import {useContext, useState} from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import { AuthContext } from '../../contexts/AuthContext';
import api from '../../services/api';


/**
 * Login component facilitates user authentication by capturing email and password inputs,
 * sending them to the authentication API, and handling the authentication state and potential errors.
 *
 * @returns A React functional component rendering the login form.
 */

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", {
        email,
        password,
      });
      await login(email, password);
    // localStorage.setItem("token", response.data.token);
    // window.location.href = "/dashboard";
      console.log(response.data);
    } catch (err: any) {
      setError(err.response.data.message || err.message);
    }
  };

return (
    <Container maxWidth="sm" className="mt-10">
        {/* Page heading */}
        <Typography variant="h4">Login</Typography>
        
        {/* Login form */}
        <form onSubmit={handleLogin}>
            {/* Email input field */}
            <TextField
                label="Email"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            
            {/* Password input field */}
            <TextField
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
            />
            
            {/* Login button */}
            <Button
                type="submit" 
                variant="contained"
                color="primary"
                fullWidth
                disabled={!email || !password}
            >
                Login
            </Button>
        </form>
        
        {/* Error message display */}
        {error && (
            <Typography color="error" variant="body2">
                {error}
            </Typography>
        )}
    </Container>
);
}

export default Login;