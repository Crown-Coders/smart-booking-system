import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const services = [
  { name: "Educational Psychologist", icon: "01", blurb: "Academic, emotional, and developmental support for learners." },
  { name: "Couple Therapy", icon: "02", blurb: "Strengthen communication, repair trust, and rebuild connection." },
  { name: "Occupational Therapist", icon: "03", blurb: "Support for daily functioning, adjustment, and recovery." },
  { name: "Speech and Language Therapy", icon: "04", blurb: "Professional help with communication and language development." },
  { name: "Family Therapist", icon: "05", blurb: "Navigate conflict, transitions, and healthier family dynamics." },
  { name: "Counselling", icon: "06", blurb: "General emotional support for stress, grief, and life challenges." },
  { name: "Trauma Counselling", icon: "07", blurb: "Compassionate trauma-informed care for recovery and grounding." },
];

const normalise = (value) => String(value || "").toLowerCase();

const therapistMatchesService = (therapist, selectedService) => {
  if (!selectedService) return false;

  const selectedId = String(selectedService.id || "");
  const selectedName = normalise(selectedService.name);

  const serviceMatch = Array.isArray(therapist.services) && therapist.services.some((service) => {
    const serviceId = String(service?.id || "");
    const serviceName = normalise(service?.name);
    return (selectedId && serviceId === selectedId) || serviceName === selectedName;
  });

  if (serviceMatch) return true;

  return normalise(therapist.specialization) === selectedName;
};

const demoTherapists = [
  {
    id: "demo-1",
    service: "Educational Psychologist",
    user: { name: "Lerato Mokoena" },
    specialization: "Educational Psychologist",
    yearsOfExperience: 8,
    image: "https://i.pravatar.cc/150?u=demo-lerato",
  },
  {
    id: "demo-2",
    service: "Couple Therapy",
    user: { name: "Anesu Dube" },
    specialization: "Couple Therapy",
    yearsOfExperience: 10,
    image: "https://i.pravatar.cc/150?u=demo-anesu",
  },
  {
    id: "demo-3",
    service: "Occupational Therapist",
    user: { name: "Nomhle Jacobs" },
    specialization: "Occupational Therapist",
    yearsOfExperience: 6,
    image: "https://i.pravatar.cc/150?u=demo-nomhle",
  },
  {
    id: "demo-4",
    service: "Speech and Language Therapy",
    user: { name: "Kamogelo Sithole" },
    specialization: "Speech and Language Therapy",
    yearsOfExperience: 7,
    image: "https://i.pravatar.cc/150?u=demo-kamogelo",
  },
  {
    id: "demo-5",
    service: "Family Therapist",
    user: { name: "Zanele Peters" },
    specialization: "Family Therapist",
    yearsOfExperience: 9,
    image: "https://i.pravatar.cc/150?u=demo-zanele",
  },
  {
    id: "demo-6",
    service: "Counselling",
    user: { name: "Mpho Naidoo" },
    specialization: "Counselling",
    yearsOfExperience: 5,
    image: "https://i.pravatar.cc/150?u=demo-mpho",
  },
  {
    id: "demo-7",
    service: "Trauma Counselling",
    user: { name: "Ayanda Khumalo" },
    specialization: "Trauma Counselling",
    yearsOfExperience: 11,
    image: "https://i.pravatar.cc/150?u=demo-ayanda",
  },
];

export default function Services() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState(null);
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    const fetchTherapists = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/therapists`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        setTherapists(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch therapists:", err);
        setTherapists([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTherapists();
  }, []);

  const visibleTherapists = useMemo(() => {
    if (!selectedService) return [];

    if (!isAuthenticated) {
      return demoTherapists.filter((therapist) => therapistMatchesService(therapist, selectedService));
    }

    return therapists.filter((therapist) => therapistMatchesService(therapist, selectedService));
  }, [isAuthenticated, selectedService, therapists]);

  const selectedServiceMeta = services.find((service) => service.name === selectedService?.name);

  return (
    <div className="services-page">
      <section className="services-hero">
        <div className="services-hero__content">
          <p className="section-tag">Services</p>
          <h1>Choose the kind of support you need right now.</h1>
          <p>
            Explore therapist categories first, then move into a booking flow that stays clear and calm.
          </p>
        </div>
      </section>

      <section className="services-shell">
        <div className="services-shell__header">
          <button
            className="services-back"
            onClick={() => (selectedService ? setSelectedService(null) : navigate(-1))}
          >
            Back
          </button>

          <div>
            <h2>{selectedService?.name || "Browse Services"}</h2>
            <p>
              {selectedServiceMeta?.blurb || "Start with a service, then choose from available therapists."}
            </p>
          </div>
        </div>

        {!selectedService && (
          <div className="services-grid">
            {services.map((service) => (
              <button
                key={service.name}
                className="service-card"
                onClick={() => setSelectedService(service)}
              >
                <span className="service-card__index">{service.icon}</span>
                <h3>{service.name}</h3>
                <p>{service.blurb}</p>
              </button>
            ))}
          </div>
        )}

        {selectedService && (
          <div className="therapists-panel">
            <div className="therapists-panel__summary">
              <span>
                {!isAuthenticated
                  ? `${visibleTherapists.length} example therapist${visibleTherapists.length === 1 ? "" : "s"}`
                  : loading
                    ? "Loading therapists..."
                    : `${visibleTherapists.length} therapist${visibleTherapists.length === 1 ? "" : "s"} available`}
              </span>
              {!isAuthenticated ? (
                <span>Sign in to see live availability and book a real therapist.</span>
              ) : null}
            </div>

            {!loading && visibleTherapists.length === 0 ? (
              <div className="services-empty">
                <h3>{isAuthenticated ? "No therapists are visible yet" : "No examples available yet"}</h3>
                <p>
                  {isAuthenticated
                    ? `No therapists are currently assigned to ${selectedService?.name}.`
                    : "Choose another service or sign in to view live therapist availability."}
                </p>
              </div>
            ) : (
              <div className="therapists-list">
                {visibleTherapists.map((therapist) => (
                  <article key={therapist.id} className="therapist-card">
                    <img
                      src={therapist.image || `https://i.pravatar.cc/150?u=therapist-${therapist.id}`}
                      alt={therapist.user?.name || "Therapist"}
                      className="therapist-card__image"
                    />
                    <div className="therapist-card__body">
                      <div className="therapist-card__eyebrow">Verified therapist</div>
                      <h3>Dr. {therapist.user?.name || "Therapist"}</h3>
                      <p className="therapist-card__specialty">{therapist.specialization || selectedService?.name}</p>
                      <p className="therapist-card__meta">
                        {therapist.yearsOfExperience || 0} years experience
                      </p>
                    </div>
                    <button
                      className="primary-btn therapist-card__button"
                      onClick={() => {
                        if (isAuthenticated) {
                          navigate("/calendar", { state: { therapist } });
                          return;
                        }
                        navigate("/login");
                      }}
                    >
                      {isAuthenticated ? "Book Session" : "Login To Book"}
                    </button>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
