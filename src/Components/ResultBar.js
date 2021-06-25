import { LinearProgress, withStyles } from "@material-ui/core";


const ResultBar = withStyles((theme) => ({
    colorPrimary: {
      
    },
    bar: {
      backgroundColor: "#51bfff",
      borderRadius: "40px",
      boxShadow: "0px 0px 40px -16px rgba(38,110,151,0.75) inset"
    },
}))(LinearProgress);

export default ResultBar;