function App() {
  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>DevOps Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: "20px",
        }}
      >
        <div style={{ background: "#eee", padding: "20px" }}>
          <h2>Users</h2>
          <p>1200</p>
        </div>

        <div style={{ background: "#eee", padding: "20px" }}>
          <h2>Revenue</h2>
          <p>$54,000</p>
        </div>

        <div style={{ background: "#eee", padding: "20px" }}>
          <h2>Orders</h2>
          <p>340</p>
        </div>
      </div>
    </div>
  );
}

export default App;