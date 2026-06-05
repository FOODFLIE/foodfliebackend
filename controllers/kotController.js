const { generateKOT, generateESCPOS, generateTextKOT } = require("../services/kotService");

/**
 * Get KOT data for an order
 */
const getKOTData = async (req, res) => {
  try {
    const { order_id } = req.params;
    const kotData = await generateKOT(order_id);
    
    res.status(200).json({
      success: true,
      data: kotData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get ESC/POS formatted KOT for thermal printer
 */
const getESCPOSKOT = async (req, res) => {
  try {
    const { order_id } = req.params;
    const kotData = await generateKOT(order_id);
    const escposData = generateESCPOS(kotData);
    
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename="KOT_${order_id}.bin"`);
    res.send(Buffer.from(escposData, 'binary'));
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get text formatted KOT
 */
const getTextKOT = async (req, res) => {
  try {
    const { order_id } = req.params;
    const kotData = await generateKOT(order_id);
    const textKOT = generateTextKOT(kotData);
    
    res.setHeader('Content-Type', 'text/plain');
    res.send(textKOT);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Print to USB thermal printer
 */
const printUSB = async (req, res) => {
  try {
    const { order_id } = req.params;
    const kotData = await generateKOT(order_id);
    const escposData = generateESCPOS(kotData);
    
    res.json({
      success: true,
      message: "ESC/POS data generated for USB printing",
      data: Buffer.from(escposData, 'binary').toString('base64'),
      instructions: "Send this base64 data to your USB printer driver"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Print to network thermal printer
 */
const printNetwork = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { printer_ip, printer_port = 9100 } = req.body;
    
    if (!printer_ip) {
      return res.status(400).json({
        success: false,
        message: "Printer IP address is required"
      });
    }
    
    const kotData = await generateKOT(order_id);
    const escposData = generateESCPOS(kotData);
    
    const net = require('net');
    const client = new net.Socket();
    
    client.connect(printer_port, printer_ip, function() {
      client.write(Buffer.from(escposData, 'binary'));
      client.end();
    });
    
    client.on('close', function() {
      res.json({
        success: true,
        message: `KOT sent to printer at ${printer_ip}:${printer_port}`
      });
    });
    
    client.on('error', function(err) {
      res.status(500).json({
        success: false,
        message: `Printer connection failed: ${err.message}`
      });
    });
    
    client.setTimeout(5000, function() {
      client.destroy();
      res.status(500).json({
        success: false,
        message: "Printer connection timeout"
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getKOTData,
  getESCPOSKOT,
  getTextKOT,
  printUSB,
  printNetwork
};
