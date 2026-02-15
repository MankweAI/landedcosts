import {
    Info, TrendingUp, Wallet, PieChart,
    Calculator, Search, ArrowRightLeft, Save, Bell, Database, HelpCircle, ChevronLeft, ChevronRight,
    ChevronDown, ChevronUp
} from "lucide-react";

import { AppShell } from "../src/components/shell/AppShell";
import { MoneyPageClient } from "../src/components/money-page/MoneyPageClient";

const icons = {
    Info, TrendingUp, Wallet, PieChart,
    Calculator, Search, ArrowRightLeft, Save, Bell, Database, HelpCircle, ChevronLeft, ChevronRight,
    ChevronDown, ChevronUp
};

let failed = false;

console.log("AppShell:", typeof AppShell);
if (typeof AppShell === 'undefined') {
    console.error("FAIL: AppShell is undefined");
    failed = true;
}

console.log("MoneyPageClient:", typeof MoneyPageClient);
if (typeof MoneyPageClient === 'undefined') {
    console.error("FAIL: MoneyPageClient is undefined");
    failed = true;
}

for (const [name, icon] of Object.entries(icons)) {
    if (typeof icon === 'undefined') {
        console.error(`FAIL: ${name} is undefined`);
        failed = true;
    }
}

if (failed) {
    process.exit(1);
} else {
    console.log("SUCCESS: All checked components are defined");
}
