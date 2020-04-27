import React ,{useState,useEffect}from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './Balance.css';


export default function Balance(props) {

  const [sum,setSum] = useState(props.storageValue);
  const [depositSum,setDepositSum] = useState(0)
  
  useEffect(()=>{
    setSum(props.storageValue)
  },[props.storageValue])

  return (
    <div className="balance ">
        <span className="margin10px totalPlata">Balance: {sum}</span>
        <div className="flex-row">
            <TextField className="margin10px inputBalance" label="Suma depozit" variant="outlined" size="small" className=""  onChange={(e)=>{
            setDepositSum(e.target.value);
            }}/>
            <Button className="margin10px" variant="contained" className="bttn" size="small" color="primary" onClick={()=>{
                if(depositSum!=0)
                {
                    props.deposit(depositSum)
                    // setDepositSum()
                }
                }}>
            Deposit
            </Button>
        </div>
    </div>
  );
}