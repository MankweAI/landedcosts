import { calculateLandedCost, calculateMaxFob, createBaseInput } from "../src/lib/calc/engine";
import { formatCurrencyZar } from "../src/lib/format";

// Helper to print results
function printCase(title: string, result: any) {
    console.log(`\n=== ${title} ===`);
    console.log(JSON.stringify(result, null, 2));
}

function runTests() {
    console.log("Starting Moat Feature Verification...");

    const base = createBaseInput({
        invoiceValueZar: 100000,
        freightZar: 10000,
        portOfEntry: "DBN",
        shippingMode: "LCL",
        useAgencyEstimate: true,
        risk_demurrageDays: 0,
        risk_forexBuffer: 0
    });

    // 1. Port Charges: DBN vs CPT
    const dbnOutput = calculateLandedCost(base);
    const cptOutput = calculateLandedCost({ ...base, portOfEntry: "CPT" });

    const dbnPort = dbnOutput?.breakdown.find(lines => lines.id === "shipping")?.amountZar;
    const cptPort = cptOutput?.breakdown.find(lines => lines.id === "shipping")?.amountZar;

    console.log(`\n1. Port Charges Test:`);
    console.log(`DBN Port Charge: ${dbnPort}`);
    console.log(`CPT Port Charge: ${cptPort}`);
    if (Number(dbnPort) > Number(cptPort)) {
        console.log("PASS: DBN is higher than CPT (Surcharge applied).");
    } else {
        console.error("FAIL: DBN should be higher.");
    }

    // 2. Agency Fees
    const agencyOutput = calculateLandedCost({ ...base, useAgencyEstimate: true });
    const agencyFee = agencyOutput?.breakdown.find(lines => lines.id === "agency")?.amountZar;
    console.log(`\n2. Agency Fee Test:`);
    console.log(`Auto-Estimated Agency Fee: ${agencyFee}`);
    if (Number(agencyFee) > 2000) {
        console.log("PASS: Agency fee looks reasonable.");
    } else {
        console.error("FAIL: Agency fee too low or missing.");
    }

    // 3. Risk: Demurrage
    const riskOutput = calculateLandedCost({ ...base, risk_demurrageDays: 7 }); // 7 days (3 free) -> 4 days charged
    const demurrage = riskOutput?.breakdown.find(lines => lines.id === "risk")?.amountZar;
    console.log(`\n3. Demurrage Risk Test (7 days, LCL):`);
    console.log(`Demurrage Cost: ${demurrage}`);
    if (Number(demurrage) > 0) {
        console.log("PASS: Demurrage charged.");
    } else {
        console.error("FAIL: Demurrage missing.");
    }

    // 4. Reverse Calc
    const targetPrice = 2000;
    const targetMargin = 30; // 30%
    const maxFob = calculateMaxFob(targetPrice, targetMargin, base);

    console.log(`\n4. Reverse Calc Test:`);
    console.log(`Target Price: R${targetPrice}, Margin: ${targetMargin}%`);
    console.log(`Calculated Max FOB: R${maxFob}`);

    // Verify forward
    const forwardOutput = calculateLandedCost({
        ...base,
        invoiceValueZar: maxFob * base.quantity,
        sellingPricePerUnitZar: targetPrice
    });
    console.log(`Forward Margin Check: ${forwardOutput?.grossMarginPercent}%`);

    if (Math.abs((forwardOutput?.grossMarginPercent || 0) - targetMargin) < 1) {
        console.log("PASS: Reverse calc accuracy within 1%.");
    } else {
        console.error("FAIL: Margin mismatch.");
    }
}

runTests();
