function Button({ children, onClick }) {
  return (
    <button onClick={onClick} style={{ padding: '10px 20px', border: 'none', backgroundColor: 'blue', color: 'white', cursor: 'pointer' }}>
      {children}
    </button>
  );
}

export default Button;
