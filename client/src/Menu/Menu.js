import React ,{useState,useEffect} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import './Menu.css'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '50%',
    margin: "0px 30px 0px 100px",
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function Menu(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const [codFactura,setCodFactura] = useState("");
  const [totalPlata,setTotalPlata] = useState(0);
  const [statusFactura,setStatusFactura] = useState("");
  const [clientFactura,setClientFactura] = useState("");
  const [companieFactura,setCompanieFactura] = useState("");
  const [validFactura,setValidFactura] = useState(false)


  const [codFacturaRegister,setCodFacturaRegister] = useState("");
  const [numeFacturaRegister,setNumeFacturaRegister] = useState("");
  const [totalFacturaRegister,setTotalFacturaRegister] = useState(null);

  const [notFound,setNotFound] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
          aria-label="scrollable force tabs example"
        >
          {
            props.clientName?
            <Tab label="Plateste factura" {...a11yProps(0)} />
            :<span></span>
          }
          {
            props.companyName?
            <Tab label="Inregistreaza factura" {...a11yProps(1)} />
            :<span></span>
          }
        </Tabs>
      </AppBar>
      {props.clientName?
      <TabPanel value={value} index={0}>
        <form className="mainForm greybackground" noValidate autoComplete="off">
            <TextField  label="Cod factura" className="codFactura"  onChange={(e)=>{
                setCodFactura(e.target.value);
            }}/>
            {totalPlata?
            <div className="mainForm">
                <span className="totalPlata">Total de plata: {totalPlata}</span>
                <span className="totalPlata">Status factura: {statusFactura?" Platita":" Neplatita"}</span>
                <span className="totalPlata">Client: {clientFactura}</span>
                <span className="totalPlata">Companie: {companieFactura}</span>
            </div>:<div></div>}
            {notFound?
                <span className="totalPlata">Nu a fost gasita o factura cu acest cod</span>:
                <span></span>
            }
            <div>
                <Button variant="contained" className="bttn" color="primary" onClick={()=>{
                    if(codFactura)
                    {
                        props.findBill(codFactura).then((bill)=>{
                            if(bill)
                            {   
                                setNotFound(false)
                                setStatusFactura(bill[0]);
                                setCodFactura(bill[1]);
                                setTotalPlata(bill[2]);
                                setClientFactura(bill[3]);
                                setCompanieFactura(bill[4]);
                            }
                            else{
                                setNotFound(true)
                            }
                        }).catch(error=>{
                            setNotFound(true)
                        })
                    
                    }
                }}>
                Gaseste Factura
                </Button>
                <Button variant="contained" className="bttn" color="primary" onClick={()=>{
                    if(totalPlata!=0)
                    props.payBill(codFactura);
                    }}>
                Plateste
                </Button>
            </div>
        </form>
      </TabPanel>
      :<div></div>
      }
      {props.companyName?
      <TabPanel value={value} index={1}>
      <form className="mainForm greybackground" noValidate autoComplete="off">
            <TextField label="Cod factura" className="codFactura"  onChange={(e)=>{
                setCodFacturaRegister(e.target.value);
            }}/>
            <TextField label="Nume client" className="codFactura"  onChange={(e)=>{
                setNumeFacturaRegister(e.target.value);
            }}/>
            <TextField label="Total Plata" className="codFactura"  onChange={(e)=>{
                setTotalFacturaRegister(e.target.value);
            }}/>
            <div>
                <Button variant="contained" className="bttn" color="primary" onClick={()=>{
                    if(codFacturaRegister && numeFacturaRegister && totalFacturaRegister)
                        props.registerBill(codFacturaRegister,totalFacturaRegister,numeFacturaRegister)
                    }}>
                 Inregistreaza factura
                </Button>
            </div>
        </form>
      </TabPanel>
      :<div></div>
      }
    </div>
  );
}
