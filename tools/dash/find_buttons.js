#!/usr/bin/env node

process.env.NODE_ENV = 'test'
//simple module for finding your button's mac

const int_array_to_hex = require('node-dash-button').int_array_to_hex;
const create_session = require('node-dash-button').create_session;
const manufacturer_directory = require('../../node_modules/node-dash-button/stor.js').manufacturer_directory;

const path = require('path');

const colors = require('colors');
const pcap = require('pcap');

let iface = undefined;

const last_argument = process.argv[process.argv.length - 1];

if (last_argument.indexOf(path.basename(process.mainModule.filename)) === -1) {
    iface = last_argument;
}

const pcap_session = create_session(iface, 'all');

const ETHERTYPE_UDP = 2048;
const ETHERTYPE_ARP = 2054;
const ATI_MFG = "Amazon Technologies Inc.";

console.log(`Watching for ARP & UDP requests on your local network, please try to press your dash now\nDash buttons should appear as manufactured by '${ATI_MFG.bold}' `);

pcap_session.on('packet', function(raw_packet) {
    const packet = pcap.decode.packet(raw_packet); //decodes the packet
    if(packet.payload.ethertype === ETHERTYPE_ARP || packet.payload.ethertype === ETHERTYPE_UDP) { //ensures it is an arp or udp packet
        let protocol, possible_dash;
        if (packet.payload.ethertype === ETHERTYPE_ARP) {
            protocol = 'ARP';
            possible_dash = packet.payload.payload.sender_ha.addr; //getting the hardware address of the possible dash
        }
        else {
            protocol = 'UDP';
            possible_dash =  packet.payload.shost.addr;
        }
        possible_dash = int_array_to_hex(possible_dash);

        var log = ' dash hardware address detected: {0} Manufacturer: {1} ({3}) Protocol: {2}',
            manufacturerKey = possible_dash.slice(0,8).toString().toUpperCase().split(':').join(''),
            manufacturer;

        if(manufacturer_directory.hasOwnProperty(manufacturerKey)) {
          manufacturer = manufacturer_directory[manufacturerKey];
        } else {
          manufacturer = 'unknown';
        }

        if (manufacturer.toLowerCase().indexOf("amazon") !== -1) {
          if (manufacturer === ATI_MFG) {
            log = ("Likely".bold + log).green.underline;
          } else {
            log = ("Possible".italic + log).yellow;
          }
        } else {
            log = ("Unlikely" + log).grey;
        }

        console.log(log.replace('{0}', possible_dash).replace('{1}', manufacturer).replace('{2}', protocol).replace('{3}', manufacturerKey));
    }
});
