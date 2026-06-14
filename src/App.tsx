import { isHelpSubdomain } from "./utils/urls";
import HelpApp from "./HelpApp";
import MainApp from "./MainApp";

export default function App() {
  if (isHelpSubdomain()) {
    return <HelpApp />;
  }
  return <MainApp />;
}
