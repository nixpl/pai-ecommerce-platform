import Navbar from './Navbar';

export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="main-content">
        <div className="container">{children}</div>
      </main>
      <footer className="footer">
        <div className="container footer-inner">
          <p>PAI E-Commerce Platform — projekt mikroserwisowy z React (CSR)</p>
        </div>
      </footer>
    </div>
  );
}
