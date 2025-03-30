import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hook/useAuth";
import "../style/loginLayout.css";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon
} from "mdb-react-ui-kit";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await login({ username, password });
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
        setError("Invalid username or password"); 
      }
  };
  return (
    <MDBContainer fluid className="login-page">
      <MDBRow className="d-flex justify-content-center align-items-center h-200">
        <MDBCol col="12">
          <MDBCard className="bg-dark text-white my-5 mx-auto" style={{ borderRadius: "1rem", maxWidth: "500px" }}>
            <MDBCardBody className="p-5 d-flex flex-column align-items-center mx-auto w-100">
              <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
              <p className="text-white-50 mb-5">Please enter your login and password!</p>

              <MDBInput
                wrapperClass="mb-4 w-100"
                labelClass="text-white"
                label="Username"
                id="username"
                type="text"
                size="lg"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <MDBInput
                wrapperClass="mb-4 w-100"
                labelClass="text-white"
                label="Password"
                id="password"
                type="password"
                size="lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && <p className="text-danger">{error}</p>}

              <MDBBtn outline className="mx-2 px-5" color="white" size="lg" onClick={handleLogin}>
                Login
              </MDBBtn>

              <div className="d-flex flex-row mt-3 mb-5">
                <MDBBtn tag="a" color="none" className="m-3" style={{ color: "white" }}>
                  <MDBIcon fab icon="facebook-f" size="lg" />
                </MDBBtn>
                <MDBBtn tag="a" color="none" className="m-3" style={{ color: "white" }}>
                  <MDBIcon fab icon="twitter" size="lg" />
                </MDBBtn>
                <MDBBtn tag="a" color="none" className="m-3" style={{ color: "white" }}>
                  <MDBIcon fab icon="google" size="lg" />
                </MDBBtn>
              </div>

              <div>
                <p className="mb-0">
                  Don't have an account? <a href="#!" className="text-white-50 fw-bold">Sign Up</a>
                </p>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Login;
