import { useState } from "react";
import { Button } from "react-bootstrap";
import { auth } from "../../config/firebase";
import { ReactComponent as LogoutIcon } from "../../includes/icons/logout.svg";

export const LogOutButton = () => {
  const [back, setBack] = useState("#414141");

  async function logOut() {
    await auth.signOut();
    localStorage.setItem("uid", "");
    window.location.reload(false);
  }

  return (
    <Button
      variant="transparent p-0 m-0"
      size="sm"
      className="transparentButton"
      style={{ boxShadow: "0px 0px 0px rgba(0, 0, 0, 0.0)" }}
    >
      <LogoutIcon
        fill={back}
        style={{
          transition: "1s",
          width: "20px",
          height: "20px"
        }}
        onMouseOver={() => {
          setBack("#666666");
        }}
        onMouseOut={() => {
          setBack("#414141");
        }}
        onClick={() => {
          logOut();
        }}
      />
    </Button>
  );
};
