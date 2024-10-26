function returnNetworkAddress(rawIPAddress, rawSubnetMask) {
    //split the word into bytes
    const iPAddressBytes = rawIPAddress.split(".");
     //split the word into bytes
    const subnetMaskBytes = rawSubnetMask.split(".");
    //stage the arrays
    let network = [];
    let sum = [];
    let binaryIP = [];
    let binarySubMask = [];
    let binaryWildcardMask = [];
    let wildcardMask = [];
    
    //display varibles
    const outputNetwork = document.getElementById("network");
    const outputBroadcast = document.getElementById("broadcast");
    const outputTotalUsableHosts = document.getElementById("usableHosts");
    const outputTotalIPs = document.getElementById("totalHosts");
    const outputBinaryAddress= document.getElementById("bin-ipaddr");
    const outputBinarySubnetMask = document.getElementById("bin-submask");
    const outputWildcardMask = document.getElementById("wildcard");
    const outputBinaryWildcardMask = document.getElementById("binary-wildcard-mask");
    const outputStatus = document.getElementById("statusPane");
    const outputIPClass = document.getElementById("ipclass");
    
    // validate every byte in the word.
    for (byte in iPAddressBytes){
        //call the validating functions and pass it the bytes
        if(validateSubnetMask(subnetMaskBytes, byte) && validateIPAddress(iPAddressBytes, byte)) {
            // run an AND between the subnet byte and corresponding ip byte, store result in network variable
            network[byte] = [iPAddressBytes[byte] & subnetMaskBytes[byte]];
            // store a sum of all the 1s for the subnet mask
            sum += returnDecimalToBinary(parseInt(subnetMaskBytes[byte])) ;
            // convert the ip address, subnet mask binary.
            binarySubMask += returnDecimalToBinary(parseInt(subnetMaskBytes[byte]))+ ".";
            binaryIP += returnDecimalToBinary(parseInt(iPAddressBytes[byte]))+ ".";
            //invert the subnet mask's bits to create a wildcard mask
            binaryWildcardMask += (returnDecimalToBinary(parseInt(subnetMaskBytes[byte])).split('').map(b => (1 - b).toString()).join('')) + ".";
            wildcardMask += (255 - parseInt(subnetMaskBytes[byte])) + ".";
    
        
        }
        // either the address or the mask is unvalidated, so its an invalid.
        else {return(outputStatus.innerText="Invalid IP and/or Subnet", outputStatus.style.backgroundColor="red")}     
    }
    // retun the network, regex the sum array and only return the 1s... then count 
        //them for the mask. lazy and not elegant but it does the job.
        //display the network with CIDR
        outputStatus.style.backgroundColor = "#2ecc71 ";
        outputStatus.innerText = "RESULTS";
        outputNetwork.innerText = network.join(".")+"/"+ sum.match(/1/g).length;
        outputBroadcast.innerText = calculateBroadcastAddress(rawIPAddress, rawSubnetMask);
        // calculate the host bits and use that to calculate the number of total addresses (2n, where n is host bits)
        outputTotalIPs.innerText = Math.pow(2,(32-sum.match(/1/g).length));
        // calculate the host bits and use that to calculate the number of total *usable* addresses (2n-2, where n is host bits)
        outputTotalUsableHosts.innerText =  (Math.pow(2,(32-sum.match(/1/g).length))) - 2;
        //display the binary data, poppping off the ".", was probably a better way to do this but cbf lol
        outputBinaryAddress.innerText = binaryIP.slice(0, binaryIP.length -1);
        outputBinarySubnetMask.innerText = binarySubMask.slice(0,binarySubMask.length -1);
        outputBinaryWildcardMask.innerText = binaryWildcardMask.slice(0,binaryWildcardMask.length - 1);
        outputWildcardMask.innerText = wildcardMask.slice(0, wildcardMask.length -1);
        outputIPClass.innerText = returnIPClass(iPAddressBytes)+" | "+returnIPAddressType(iPAddressBytes);

        
}

//validates the subnet mask
function validateSubnetMask( subnetMask, byte){
    let correctByteLength = 4;
    let subnetMaskBytes = subnetMask;
    // it can only be one of these numbers
    const masks=[255,254,252,248,240,224,192,128,0];

    //if the next byte is not all 0s, then the current byte has to be all 1s
    if((byte <= 2) && ((subnetMaskBytes[byte] != 255) && (subnetMaskBytes[parseInt(byte)+1] != 0 ) ||
     subnetMaskBytes.length != correctByteLength))
        {return false;}
    //each byte should be a valid decimal and be contiguous
    else if (masks.includes(parseInt(subnetMaskBytes[byte])) && 
        (subnetMaskBytes[0] >= subnetMaskBytes[1]) &&
        (subnetMaskBytes[1] > subnetMaskBytes[2] || subnetMaskBytes[1] == 255 || subnetMaskBytes[1] == 0) &&
        (subnetMaskBytes[2] > subnetMaskBytes[3] || subnetMaskBytes[2] == 255 || subnetMaskBytes[2] == 0) 
        
    ){ return true; }  
}

//validate the IP address 
function validateIPAddress(ipaddress, byte){
    let correctByteLength = 4;
    let ipaddressBytes = ipaddress;
    // the ip address has to be 4 bytes and singular decimal byte
    if ((ipaddressBytes.length == correctByteLength) && ipaddressBytes[byte] <= 255 && ipaddressBytes[byte] >=0 ){return true;}
    else {return false;}
}

//convert decimal to binary
// i could have used ".toString(2), but that wont return the leading zeros, which is an issue when calculating the wildcard
// i also i wanted to write as much of this as possible"
function returnDecimalToBinary(number) {
    let binary = [];
    let index =0;
    let newBinary = [];

    //use the division method to return the binary number.
    while(number > 0){
       binary += number %2;
       number = parseInt(number / 2);
    }

   for(let i = binary.length -1; i >= 0; i--){newBinary[index++] = binary[i]}
    // 8 (byte length) - the current binary digits
    // basically prepend however many zerors ar missing from making the byte 8 elements long.
    const zerosToAdd = Math.max(8 - newBinary.length, 0);   
    return '0'.repeat(zerosToAdd) + newBinary.join("")
}

function calculateBroadcastAddress(networkAddress, subnetMask) {
    // convert network address and subnet mask to binary strings
    const networkBinary = networkAddress.split('.').map(octet => parseInt(octet).toString(2).padStart(8, '0')).join('');
    const subnetBinary = subnetMask.split('.').map(octet => parseInt(octet).toString(2)).join('');
    // calculate the number of network bits from the subnet mask, pretty much the same way the network is calculated
    const networkBits = subnetBinary.replace(/0/g, '').length;
    // calculate the host bits
    const hostBits = 32 - networkBits;
    // calculate the network portion of the address
    const networkPortion = networkBinary.slice(0, networkBits);
    // calculate the host portion (all ones) for the broadcast address
    const hostPortion = '1'.repeat(hostBits);
    // combine the network and host portions
    const broadcastBinary = networkPortion + hostPortion;
    // convert the binary broadcast address back to decimal
    const broadcastAddress = broadcastBinary.match(/.{1,8}/g).map(byte => parseInt(byte, 2)).join('.');
    return broadcastAddress;
}

function returnIPClass(ipaddress){
    let firstOctet =  parseInt(ipaddress[0]) ;
    if ( firstOctet >= 1 && firstOctet <=127) {return "Class A";}
    else if( firstOctet >= 128 && firstOctet <=191) {return "Class B";}
    else if( firstOctet >= 192 && firstOctet <=223) {return "Class C";}
    else if( firstOctet >= 224 && firstOctet <=239) {return "Class D";}
    else if( firstOctet >= 240 && firstOctet <=254) {return "Class E";}
}

function returnIPAddressType(ipaddress){
    let firstOctet = parseInt(ipaddress[0]);
    let secondOctet = parseInt(ipaddress[1]);

    if((firstOctet == 10) || 
    (firstOctet == 192 && secondOctet == 168) ||
    (firstOctet == 172 && secondOctet >=16 && secondOctet <= 31)){return "RFC1918 Private Address"}
    else {return "Public Address";}
}

// display the values
function displayNetwork(){
rawIPAddress = document.getElementById('ipaddr').value;
rawSubnetMask = document.getElementById('submask').value;
returnNetworkAddress(rawIPAddress, rawSubnetMask);
}
// call the function
displayNetwork();


// Config Generator 
//VARIABLES

function address(){
    //VARIABLES
    const MY_FORM = document.getElementById("myForm");
    const CSV_FILE = document.getElementById("CSV_FILE");
    const TEXTAREA = document.getElementById("TEXTAREA");
    const ADDR_GROUP = document.getElementById("address-group");
    const TICKET_NUMBER = document.getElementById("ticket-number");
    const FQDN = document.getElementById('fqdn-radio');
    const SUBNET = document.getElementById('subnet-radio');

 //Address objects
  function generateAddressObjects (IP){
    if(TICKET_NUMBER.value.length > 0){
      TEXTAREA.innerText = ""
      TEXTAREA.append("config firewall address\n")
         //iterate though the IPs 
         for  (let i = 1;  i < IP.length; i++){
          const SANITISED_IP_ADDR = IP[i].trim()
          if(SANITISED_IP_ADDR.length <= 0){
              continue
            } 
          else {
            
            TEXTAREA.append(`edit ${SANITISED_IP_ADDR}\n`)
            TEXTAREA.append(`set subnet ${SANITISED_IP_ADDR} 255.255.255.255\n`)
            TEXTAREA.append(`set comment ${TICKET_NUMBER.value} \n`)
            TEXTAREA.append("next\n") 
          }}
      TEXTAREA.append("end\n")
    }else{
            TEXTAREA.innerText = "";
            TEXTAREA.append("Error! Please enter a Ticket number")}
  }

  //Address group name
  function generateAddressGroup(IP){
    if(ADDR_GROUP.value.length > 0){
      TEXTAREA.append("config firewall addrgrp\n")
      TEXTAREA.append(`edit ${ADDR_GROUP.value.trim()}\n`)
         for  (let i = 1;  i < IP.length; i++){
          const SANITISED_IP_ADDR = IP[i].trim()  
          if(SANITISED_IP_ADDR.length <= 0){
              continue
            }
            else{
              TEXTAREA.append(`append member ${IP[i].trim()}\n`)
            }
         }
         TEXTAREA.append(`end`)
    } else{
      TEXTAREA.innerText = "";
      TEXTAREA.append("Error! Please enter an address-group name")}
    }
  
  //FQDN address
    function generateFQDNs(FQDNs){
      if(TICKET_NUMBER.value.length > 0){
      TEXTAREA.innerText = ""
      TEXTAREA.append("config firewall address\n")
         //iterate though the IPs 
         for  (let i = 1;  i < FQDNs.length; i++){
            const SANITISED_FQDN = FQDNs[i].trim()
            if(SANITISED_FQDN.length <= 0){
              continue
            }
            else{
            TEXTAREA.append(`edit ${SANITISED_FQDN}\n`)
            TEXTAREA.append(`set type fqdn\n`)
            TEXTAREA.append(`set fqdn ${SANITISED_FQDN}\n`)
            TEXTAREA.append(`set comment ${TICKET_NUMBER.value} \n`)
            TEXTAREA.append("next\n") 
          }}
      TEXTAREA.append("end\n")
    }else{
            TEXTAREA.innerText = "";
            TEXTAREA.append("Error! Please enter a Ticket number")}
    }
//EVENT LISTENER
    MY_FORM.addEventListener("submit", function (e) {
       e.preventDefault();
       const input = CSV_FILE.files[0];
       const reader = new FileReader();

       reader.onload = function (e) {
         const TEXT = e.target.result;
         const IP_ADDRESS = (TEXT.split("\r"));

         if((SUBNET.checked) && ADDR_GROUP.value.length == 0){
          generateAddressObjects(IP_ADDRESS)
         } 
         else if (FQDN.checked && ADDR_GROUP.value.length == 0){
          generateFQDNs(IP_ADDRESS)
         }
         else if (SUBNET.checked){
          generateAddressObjects(IP_ADDRESS)
          generateAddressGroup(IP_ADDRESS)
         }
         else if(FQDN.checked){
          generateFQDNs(IP_ADDRESS)
          generateAddressGroup(IP_ADDRESS)
         }
        }
      reader.readAsText(input);
    
    });
}

function validateDestIPAddress(ipaddress) {
    let correctByteLength = 4;

    // Split the IP address by dots to create an array of bytes
    let ipaddressBytes = ipaddress.split('.');

    // Validate length of the IP address and each byte's range
    if (ipaddressBytes.length === correctByteLength) {
        for (let byte of ipaddressBytes) {
            let num = parseInt(byte);
            if (isNaN(num) || num > 255 || num < 0) {
                return false;
            }
        }
        return true;
    }

    return false;
}

// Destination Network Calculator 
function returnDestinationNetwork(){
   
    const DEST_NET_SRC_IP = document.getElementById("dest-net-src-ip");
    const DEST_NET_DST_IP = document.getElementById("dest-net-dst-ip");
    const DEST_NET_SUBMASK = document.getElementById("dest-net-submask");
    const DEST_NET_OUTPUT = document.getElementById("dest-net-output");
    
    let src_ip = DEST_NET_SRC_IP.value.split(".");
    let dest_ip = DEST_NET_DST_IP.value.split(".");
    let subnet_mask = DEST_NET_SUBMASK.value.split(".");
    let xor_result = [];
    let network = []
    let isValidSubnetMask = true;
     
    for (i= 0; i<= 3; i++){
        xor_result.push(parseInt(src_ip[i]) ^ parseInt(dest_ip[i]));
        network.push(parseInt(src_ip) & parseInt(subnet_mask[i]));
    }
    
    if (validateDestIPAddress(DEST_NET_SRC_IP.value) === false || validateDestIPAddress(DEST_NET_DST_IP.value) === false){
        DEST_NET_OUTPUT.innerText = "Invalid IP Address/Addresses";
    }
    
    else if (validateSubnetMask(DEST_NET_SUBMASK.value, )){
        DEST_NET_OUTPUT.innerText = "Invalid Subnet Mask";
    }

    else {
        let sameNetwork = true;

        for (let i = 0; i <= 3; i++) {
           
            if ((xor_result[i] & parseInt(subnet_mask[i])) !== 0) {
                sameNetwork = false;
                break;
            }
         
        }
        
        if (sameNetwork) {
            DEST_NET_OUTPUT.innerText = "Host and Destination are in the same network";
            DEST_NET_OUTPUT.style.backgroundColor = "green"
            DEST_NET_OUTPUT.style.color = "white"
        } else {
            DEST_NET_OUTPUT.innerText = "Host and Destination are in different networks, the last address in the host's range is " + calculateBroadcastAddress(DEST_NET_SRC_IP.value, DEST_NET_SUBMASK.value);
            DEST_NET_OUTPUT.style.backgroundColor = "red"
            DEST_NET_OUTPUT.style.color = "white"    
        }
    


}
}
