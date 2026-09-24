import Link from "next/link";

export default function HomePage() {
  return <main className="landing-page"><span className="eyebrow">Team workspace / 01</span><h1>Make the next move <em>visible.</em></h1><p>TaskFlow gives small teams a calm place to turn loose ideas into shared momentum.</p><Link className="button button--primary" href="/dashboard">Enter the workspace <span aria-hidden="true">↗</span></Link></main>;
}
