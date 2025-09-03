import { Homepage } from "@reiki-goddess/shared-components";
import PageTransition from "../components/PageTransition";

function Home() {
  return (
    <PageTransition>
      <div data-testid="page-home">
        <Homepage />
      </div>
    </PageTransition>
  );
}

export default Home;
