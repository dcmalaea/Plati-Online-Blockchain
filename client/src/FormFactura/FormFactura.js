import React ,{useState}from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './FormFactura.css';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch'
    },
  },
}));

export default function FormFactura(props) {

  const [codFactura,setCodFactura] = useState("");
  const [totalPlata,setTotalPlata] = useState(0);
  const classes = useStyles();
  return (
    <form className="mainForm" noValidate autoComplete="off">
      <TextField id="standard-basic" label="Cod factura" className="codFactura"  onChange={(e)=>{
          setCodFactura(e.target.value);
      }}/>
      <span className="totalPlata">Total de plata: {totalPlata}</span>
      <div>
        <Button variant="contained" className="bttn" color="primary" onClick={()=>{
            if(totalPlata==0)
              setTotalPlata(Math.floor(Math.random() * 101));
        }}>
          Gaseste Factura
        </Button>
        <Button variant="contained" className="bttn" color="primary" onClick={()=>{
            if(totalPlata!=0)
              props.spend(totalPlata)
            }}>
          Plateste
        </Button>
      </div>
    </form>
  );
}