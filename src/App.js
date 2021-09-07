import React from "react";
import { useState, useEffect } from "react";

function App() {
  const [clubs, setClubs] = useState(null);

  const [name, setName] = useState("");
  const [cups, setCups] = useState("");
  const [clubId, setClubId] = useState(null);
  
  const [updating, setUpdating] = useState(false);

  const [players, setPlayers] = useState(null);

  const createClub = async () => {
    try {
      const res = await fetch("/api/clubs", {
        method: "POST",
        body: JSON.stringify({ name, cups }),
      });
      const json = await res.json();
      setClubs([...clubs, json.club]); // Giữ lại các clb cũ đồng thời thêm clb mới vào
      setName("");
      setCups("");
    } catch (error) {
      console.log(error);
    }
  };

  const detailClub = async (id) => {
    try {
      fetch(`/api/clubs/${id}`, { method: "GET" });
      setClubs(clubs.filter(x => x.id === id));
    } catch (error) {
      console.log(error);
    }
  };

  // Lấy dữ liệu hiển thị ra các ô input để update
  const setClubToUpdate = async (id) => {
    try {
      const club = clubs.find(m => m.id === id);
      if (!club) return;
      setUpdating(true);
      setClubId(club.id);
      setName(club.name);
      setCups(club.cups);
    } catch (error) {
      console.log(error);
    }
  };

  const updateClub = async () => {
    try {
      const res = await fetch(`/api/clubs/${clubId}`, {
        method: "PATCH",
        body: JSON.stringify({ name, cups }),
      });
      const json = await res.json();
      const clubsCopy = [...clubs]; // Lấy ra các clb hiện tại
      const index = clubs.findIndex(m => m.id === clubId); // Tìm vị trí của clb cần update
      clubsCopy[index] = json.club; // Cập nhật lại dữ liệu cho clb cần update
      setClubs(clubsCopy);
      setName("");
      setCups("");
      setUpdating(false);
      setClubId(null);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteClub = async (id) => {
    try {
      fetch(`/api/clubs/${id}`, { method: "DELETE" });
      setClubs(clubs.filter(x => x.id !== id)); // Lấy ra danh sách các id khác với cái id xoá
    } catch (error) {
      console.log(error);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    try {
      if (updating) {
        updateClub();
      } else {
        createClub();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPlayers = async(id) => {
    try {
      const res = await fetch(`/api/clubs/${id}/players`)
      const json = await res.json()
      setPlayers(json.players)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetch("/api/clubs")
      .then((res) => res.json())
      .then((json) => setClubs(json.clubs))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col">
          <h1 className="fw-normal text-center my-3">CLUB IN EPL</h1>
          <div className="my-4">
            <form onSubmit={submitForm}>
              <div className="row">
                <div className="col-5">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="col-5">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Cups"
                    value={cups}
                    onChange={(e) => setCups(e.target.value)}
                  />
                </div>
                <div className="col-2">
                  <button type="submit" className="btn btn-success">
                    {updating ? "Update" : "Create"}
                  </button>
                </div>
              </div>
            </form>
          </div>
          {clubs?.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Cups</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clubs.map((club, index) => (
                  <tr key={index}>
                    <td>{club.id}</td>
                    <td>{club.name}</td>
                    <td>{club.cups}</td>
                    <td>
                      <button
                        className="btn btn-info me-3"
                        onClick={() => detailClub(club.id)}
                      >
                        Detail
                      </button>
                      <button
                        className="btn btn-warning me-3"
                        onClick={() => setClubToUpdate(club.id)}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-danger me-3"
                        onClick={() => deleteClub(club.id)}
                      >
                        Delete
                      </button>
                      <button type="button" className="btn btn-primary me-3" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => fetchPlayers(club.id)}>
                        Players
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : clubs ? (<p>No Clubs</p>) : <p>Loading</p>}
        </div>
      </div>
      {/* Modal */}
      <div className="modal fade" tabIndex="-1" id="exampleModal"> 
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Players</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
                {players?.map(player => (
                  <p key={player.id}>{player.name}</p>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
