import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { fetchOrganizersForCollaboration } from "../../../redux/action/organizerActions";
import { debounce } from "../../../utils/debounce";

export interface IOrganizersForCollaboration {
  id: number;
  name: string;
}

const CollaborationRequestModal = () => {
  const [organizers, setOrganizers] = useState<IOrganizersForCollaboration[]>([]);
  const [search, setSearch] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

  const debouncedFetchOrganizers = debounce(async (searchQuery: string) => {
    try {
      const response = await dispatch(fetchOrganizersForCollaboration(searchQuery)).unwrap();
      console.log('Fetched organizers:', response);
      setOrganizers(response);
    } catch (error) {
      console.error('Failed to fetch organizers:', error);
    }
  }, 400);

  useEffect(() => {
    if (search) {
      debouncedFetchOrganizers(search); 
    }
  }, [search]);

  return (
    <>
      <input type="checkbox" id="collaboration-request-modal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Request for Collaboration</h3>
          <p className="py-4">This modal works with a hidden checkbox!</p>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Search for organizers"
            className="input input-bordered w-full mb-4"
          />
          {organizers.length > 0 ? (
            <ul className="list-disc pl-5">
              {organizers.map((organizer) => (
                <li key={organizer.id}>{organizer.name}</li>
              ))}
            </ul>
          ) : (
            <p>No organizers found.</p>
          )}
          <div className="modal-action">
            <label htmlFor="collaboration-request-modal" className="btn">
              Close
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default CollaborationRequestModal;
