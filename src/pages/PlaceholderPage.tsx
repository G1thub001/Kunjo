
import { useLocation } from "react-router-dom";

export default function PlaceholderPage() {
  const location = useLocation();

  const pageName = location.pathname
    .replace("/", "")
    .replaceAll("-", " ");

  const title = pageName
    ? pageName.replace(/\b\w/g, (letter) => letter.toUpperCase())
    : "Coming Soon";

  return (
    <section className="placeholder-page">
      <span className="eyebrow">KUNJO BY AURAGEMS</span>
      <h1>{title}</h1>
      <p>
        Something beautiful is taking shape.
        This experience will be available soon.
      </p>
    </section>
  );
}
