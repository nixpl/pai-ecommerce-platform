import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <div className="container">{children}</div>
      </main>
    </div>
  );
}
