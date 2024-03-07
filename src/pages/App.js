// import { Outlet, Link } from "react-router-dom";
import { BrowserRouter as Router, Switch, Route,Redirect  } from "react-router-dom";
import P404 from "./homepage/error404";
import Login from "./homepage/Login/Login";
// import Routes from "../routes/router"
import DashBoard from "./page/DashBoard";
import ServiceOrder from "./page/ServiceOrder";
import CreateDoc from "./page/CreateDoc";
import DetailDoc from "./page/DetailDoc";
import Report from "./page/Report";
import MstOperator from "./Master/MstOperator"
import MstMAProject from "./Master/MstMAProject"
import MstMachineList from "./Master/MstMachineList";
import MstUserAccount from "./Master/MstUserAccount"
import MiniDrawer from "./../Components/Slidbar/Drawer"
import { makeStyles } from '@mui/styles';
// import Loading from "../components/ProgressLoading";

const useStyles = makeStyles({
  container: {
    display: "flex",
    width: "unset",
    // justifyContent: "center",
    // zoom:"80%",
    margin: 80,
  }
});

export default function App() {
  const classes = useStyles();
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return <Login />
  }
  return (
    <div className={classes.container}>
      <Router>
        <MiniDrawer />
        <Switch>
          {/* <Route path="/"><Login /></Route> */}
          <Route exact path="/">
              <Redirect to="/ServiceOrder" component={ServiceOrder}/>
            </Route>
          <Route path="/ServiceOrder" ><ServiceOrder /></Route>
          <Route path="/DashBoard" ><DashBoard /></Route>
          <Route path="/CreateDoc"><CreateDoc /></Route>
          <Route path="/DetailDoc"><DetailDoc /></Route>
          <Route path="/MstOperator"><MstOperator /></Route>
          <Route path="/MstMAProject"><MstMAProject /></Route>
          <Route path="/MstMachineList"><MstMachineList /></Route>
          <Route path="/MstUserAccount"><MstUserAccount /></Route>
          <Route path="*"> <P404 /></Route>
        </Switch>
      </Router>
    </div>
  );
}
