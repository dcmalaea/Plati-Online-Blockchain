pragma solidity >=0.4.21 <0.7.0;

contract MyContract {

    struct Bill {
        bool payed;                 // daca s-a platit factura pana acum sau nu
        int code;                   // codul facturii
        int sum;                    // totalul de plata
        string clientName;          // username-ul celui care trebuie sa plateasca factura
        address clientAddress;      // adresa 'wallet account'-ului asociat cu acel username
        string companyName;         // numele companiei ce emite factura
        address companyAddress;     // adresa 'wallet account'-ului asociat companiei
    }

    // "array" cu soldul fiecarui user si companii. Un "element" are forma: balances[0xb4517988e64d46218C9cc3E7615A55a73cc5cE09] = 500
    mapping(address => int) public balances;

    // "array" cu numele fiecarui user. Un "element" are forma: users[0xb4517988e64d46218C9cc3E7615A55a73cc5cE09] = "Ion Ionescu"
    mapping(address => string) public users;
    mapping(string => address) public userAddresses;

    // "array" cu numele fiecarui user. Un "element" are forma: companies[0xb4517988e64d46218C9cc3E7615A55a73cc5cE09] = "Electrik SRL"
    mapping(address => string) public companies;
    mapping(string => address) public companyAddresses;

    // array cu facturi
    Bill[] public bills;

    function getBalance() public view returns(int)  {

        // returneaza soldul celui care a trimis tranzactia pe blockchain
        return balances[msg.sender];
    }

    function deposit(int ammount) public {

        balances[msg.sender] += ammount;
    }

    // Sa nu uitam sa stergem functia asta ca nu vom mai avea nevoie de ea! ( folosim payBill() definita mai jos )
    function spend(int ammount) public{

        require(balances[msg.sender] >= ammount, "Nu ai destui bani, saracule!");

        balances[msg.sender] -= ammount;
    }

    // "inregistrarea" unui user - atasam wallet account-ului (din care se face tranzactia cu ETH) un username
    function associateAccountWithUser(string memory fullName) public {

        // verificam daca numele de user ales este deja luat
        require(userAddresses[fullName] == address(0), 'Acest nume este deja asociat cu un wallet account.');

        // dezasociaza contul curent de username-ul lui vechi (daca era asociat inainte cu un alt username)
        if (bytes(users[msg.sender]).length != 0) {

            userAddresses[users[msg.sender]] = address(0);
            users[msg.sender] = "";
        }

        users[msg.sender] = fullName;
        userAddresses[fullName] = msg.sender;
    }

    // "inregistrarea" unei companii - atasam wallet account-ului (din care se face tranzactia cu ETH) o companie
    function associateAccountWithCompany(string memory companyName) public {

        // verificam daca numele companiei este deja luat
        require(companyAddresses[companyName] == address(0), 'Deja exista o companie cu acest nume.');

        // dezasociaza contul curent de compania ei veche (daca era asociat inainte cu o alta companie)
        if (bytes(companies[msg.sender]).length != 0) {

            companyAddresses[companies[msg.sender]] = address(0);
            companies[msg.sender] = "";
        }

        companies[msg.sender] = companyName;
        companyAddresses[companyName] = msg.sender;
    }

    function registerBill(int billCode, int billSum, string memory clientName) public {

        // verificam daca cel care vrea sa inregistreze o factura reprezinta o companie
        require(bytes(companies[msg.sender]).length != 0, "Nu reprezentati o companie! Mai intai asociati-va contul cu o companie.");

        // verificam daca exista vreun client cu numele dat
        require(userAddresses[clientName] != address(0), "Nu exista niciun client cu numele dat.");

        require(billCode > 0, "Codul facturii trebuie sa fie un numar intreg pozitiv!");
        require(billSum > 0, "Totalul de plata trebuie sa fie un numar intreg pozitiv!");

        address clientAddress = userAddresses[clientName];
        address companyAddress = msg.sender;
        string memory companyName = companies[msg.sender];

        bills.push(
            Bill(false, billCode, billSum, clientName, clientAddress, companyName, companyAddress)
        );
    }

    function payBill(int billCode) public {

        // verificam daca cel care vrea sa plateasca o factura este un user
        require(bytes(users[msg.sender]).length != 0, "Nu sunteti inregistrat! Mai intai asociati-va contul cu un user name.");

        uint foundBillIndex;
        bool hasFoundBill = false;
        for (uint i = 0; i < bills.length; i++) {

            if (bills[i].code == billCode) {
                hasFoundBill = true;
                foundBillIndex = i;
            }
        }

        require(hasFoundBill, "Nu s-a gasit nicio factura avand codul dat.");

        Bill storage bill = bills[foundBillIndex];

        require(userAddresses[bill.clientName] == userAddresses[users[msg.sender]], "Nu aveti dreptul sa platiti aceasta factura.");

        require(!bill.payed, "Aceasta factura a fost deja platita.");

        require(balances[msg.sender] >= bill.sum, "Nu detineti bani pentru a plati aceasta factura! Va rugam sa mai depozitati.");

        balances[msg.sender] -= bill.sum;
        bill.payed = true;
    }

    /**
     * IN: billCode (int) Codul facturii
     * OUT (frontend): (array) Informatii despre factura de forma: [true, 1429, 500, "Ion Ionescu", "Electrik SRL"]
     */
    function getBillInfo(int billCode) public view returns(bool, int, int, string memory, string memory) {

        uint foundBillIndex;
        bool hasFoundBill = false;
        for (uint i = 0; i < bills.length; i++) {

            if (bills[i].code == billCode) {
                hasFoundBill = true;
                foundBillIndex = i;
            }
        }

        require(hasFoundBill, "Nu s-a gasit nicio factura avand codul dat.");

        Bill storage bill = bills[foundBillIndex];

        return ( bill.payed, bill.code, bill.sum, bill.clientName, bill.companyName );
    }
}
