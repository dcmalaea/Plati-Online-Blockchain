import React ,{useState, useEffect}from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './RegisterForm.css';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch'
    },
  },
}));

export default function RegisterForm(props) {

  const [companyName,setCompanyName] = useState(props.companyName);
  const [clientName,setClientName] = useState(props.clientName);

  const [submitClient,setSubmitClient] = useState("");
  const [submitCompany,setSubmitCompany] = useState("");

  const [registerClientVisible,setRegisterClientVisible] = useState(false);
  const [registerCompanyVisible,setRegisterCompanyVisible] = useState(false);

  useEffect(()=>{
    setCompanyName(props.companyName);
    setClientName(props.clientName);
  },[props.clientName,props.companyName]);

  const classes = useStyles();
  return (
    <form className="mainForm" noValidate autoComplete="off">
        {!clientName?
        <div className="flexColumn">
            <span className="totalPlata">Nu esti inregistrat ca utilizator</span>
            <TextField variant="outlined" label="Nume client" size="small"  onChange={(e)=>{
                setSubmitClient(e.target.value);
            }}/>
            <Button variant="contained" className="bttn" size="small" color="primary" onClick={()=>{
                if(submitClient)
                    props.submitClientName(submitClient);}}>
                Register
            </Button>
        </div>:
        <span>
            Nume client: {clientName}
        </span>
        }
        {!companyName?
        <div className="flexColumn">
            <span className="totalPlata">Nu esti inregistrat ca si companie</span>
            <TextField  label="Nume Companie"  variant="outlined"  size="small" onChange={(e)=>{
                setSubmitCompany(e.target.value);
            }}/>
            <Button variant="contained" className="bttn" color="primary" size="small" onClick={()=>{
                if(submitCompany)
                    props.submitCompanyName(submitCompany);}}>
                Register
            </Button>
        </div>:
        <span>
            Nume companie: {companyName}
        </span>
        }
    </form>
  );
}