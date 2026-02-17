import { UniversalCalcClient } from "./UniversalCalcClient";

export const metadata = {
  title: "Universal Import Calculator",
  description: "Calculate import duty, VAT, and landed cost for any product from China to South Africa."
};

export default function CalculatorPage() {
  return <UniversalCalcClient />;
}

