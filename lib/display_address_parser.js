'use strict';

function DisplayAddressParser(unformatted_address) {
  let displayAddress = unformatted_address.slice();

  let address = displayAddress.join(', ');
  console.log('address: ' + address);

    // If the area name is redundant with the city name, strip it out.
    switch (displayAddress.length) {
      case 0:
        address = "Address Unavailable";
        break;
      case 1:
        //address = displayAddress[0].split(', ').join('\n');
        break;
      case 2:
        if(displayAddress[0] == displayAddress[1].split(',')[0]){
          address = displayAddress[1];
        };
        break;
      case 3:
        if(displayAddress[1] == displayAddress[2].split(',')[0]) {
          address = [displayAddress[0], displayAddress[2]].join(', ');
        };
        if(displayAddress[1].length + displayAddress[2].length + displayAddress[0].length > 40) {
          address = [displayAddress[0], displayAddress[1]].join(', ') + '\n' + displayAddress[2];
        };
        break;
      case 4:
        if(displayAddress[2] == displayAddress[3].split(',')[0] ) {
          address = [displayAddress[0], displayAddress[1], displayAddress[3]].join(', ');
        }else if(displayAddress[0].length + displayAddress[1].length + displayAddress[2].length > 40) {
          address = [displayAddress[0], displayAddress[1]].join(', ') + '\n' + [displayAddress[2], displayAddress[3]].join(', ');
        }else {
          address = [displayAddress[0], displayAddress[1], displayAddress[2]].join(', ') + '\n' + displayAddress[3];
        };
        break;
      case 5:
        address = [displayAddress[0], displayAddress[1], displayAddress[2]].join(', ') + '\n' + [displayAddress[3], displayAddress[4
          ]].join(', ');
        break;

      default:

        break;
    };

    return address;
};

module.exports = DisplayAddressParser;

