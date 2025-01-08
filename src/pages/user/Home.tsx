import { Link } from "react-router-dom";
import Slider from "../../components/user/Slider";

const Home = () => {


  return (
    <>
    <Slider />
     <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold text-blue-900 mb-5">Home Page</h1>
      <Link to="/explore" className="bg-blue-900 text-white border-2 border-blue-900 hover:bg-blue-950 rounded px-4 py-2">Explore Events</Link>
    </div>
    {/* <div className="space-y-4">
    <Button variant="primary" rounded>Log In</Button>
    <Button variant="secondary" rounded>View More</Button>
    <Button variant="primary" fullWidth>Follow</Button>
    <Button variant="secondary" fullWidth>View Profile</Button>
    <Button variant="danger">Report</Button>
  </div>
  <div>
  <select className="select select-bordered w-full max-w-fit">
  <option disabled selected>Who shot first?</option>
  <option>Han Solo</option>
  <option>Greedo</option>
</select>
  </div> */}
    </>
  )
}

export default Home
