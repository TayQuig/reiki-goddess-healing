import { useEffect } from "react";
import PageTransition from "../components/PageTransition";
import {
  AnimatedSection,
  CommunityEvents,
  BookSessionCTA,
} from "@reiki-goddess/shared-components";

// Placeholder interface for when you connect your external API
// interface ExternalEvent {
//   id: string;
//   title: string;
//   image: {
//     src: string;
//     alt: string;
//   };
//   date?: string;
//   description?: string;
// }

function Events() {
  // FUTURE INTEGRATION: State for fetching events
  // const [events, setEvents] = useState<ExternalEvent[]>([]);
  // const [loading, setLoading] = useState(false);

  // Set page metadata
  useEffect(() => {
    document.title = "Community Events | The Reiki Goddess";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Join our healing community for special events, workshops, and group sessions at The Reiki Goddess in Roy, WA."
      );
    }
  }, []);

  // FUTURE INTEGRATION: Fetch events from your subdomain API
  /*
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Replace with your actual subdomain API endpoint
        // const response = await fetch('https://events.reikigoddesshealing.com/api/events');
        // const data = await response.json();
        // setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);
  */

  return (
    <PageTransition>
      <div className="min-h-screen" data-testid="page-events">
        <div
          className="relative mx-auto bg-[#FFFBF5] shadow-2xl max-w-[1440px]"
          style={{
            boxShadow: "0 0 40px rgba(0, 0, 0, 0.1)",
            padding: "0 66px",
          }}
        >
          {/* Header/Hero for Events could go here */}

          <AnimatedSection animation="fadeInUp">
            {/* 
              Pass the fetched events to CommunityEvents when ready.
              For now, it will use its default mock data.
              Example: <CommunityEvents events={events} />
            */}
            <CommunityEvents />
          </AnimatedSection>

          <AnimatedSection animation="fadeIn" delay={0.2}>
            <div className="py-20">
              <BookSessionCTA />
            </div>
          </AnimatedSection>
        </div>
      </div>
    </PageTransition>
  );
}

export default Events;
