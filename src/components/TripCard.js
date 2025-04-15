export default function TripCard({ title }) {
    return (
      <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all">
        <div className="card-body">
          <h2 className="card-title">{title}</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          <div className="card-actions justify-end">
            <button className="btn btn-sm btn-outline btn-primary">View</button>
          </div>
        </div>
      </div>
    )
  }
  