import { useEffect } from "react";
import HelpLayout from "./components/layout/HelpLayout";
import HelpPage from "./pages/HelpPage";
import ToastContainer from "./components/UI/Toast";

export default function HelpApp() {
  useEffect(() => {
    document.title = "DAX — Help & Rules";
  }, []);

  return (
    <>
      <HelpLayout>
        <HelpPage />
      </HelpLayout>
      <ToastContainer />
    </>
  );
}
