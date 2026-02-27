import React, { useEffect, useState } from "react";
import API from "../services/api";

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    API.get("/patient/profile")
      .then((res) => setProfile(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h2>My Profile</h2>
      {profile && (
        <div>
          <p>ID: {profile.id}</p>
          <p>Name: {profile.name}</p>
        </div>
      )}
    </div>
  );
}

export default Profile;