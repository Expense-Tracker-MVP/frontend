const HomePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] p-4">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[var(--primary-color)] mb-4">
          Expense Tracker MVP
        </h1>
        <p className="text-xl text-[var(--secondary-color)]">
          Welcome to your expense tracking app!
        </p>
      </div>
    </div>
  )
}

export default HomePage