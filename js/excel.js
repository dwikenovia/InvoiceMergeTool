// ============================================
// excel.js
// Handles Excel import
// ============================================

let mappingData = [];

async function loadExcel(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = function(e){

            try{

                const workbook = XLSX.read(
                    e.target.result,
                    { type:"array" }
                );

                const sheet =
                    workbook.Sheets[
                        workbook.SheetNames[0]
                    ];

                const rows =
                    XLSX.utils.sheet_to_json(sheet);

                if(rows.length === 0){

                    reject("Excel is empty.");

                    return;

                }

                const headers =
                    Object.keys(rows[0]);

                const invoiceColumn =
                    detectInvoiceColumn(headers);

                const bidColumn =
                    detectBidColumn(headers);

                if(!invoiceColumn)
                    throw "Invoice Number column not found.";

                if(!bidColumn)
                    throw "BID column not found.";

                mappingData =
                    rows.map(r=>{

                        return{

                            invoice:
                                String(
                                    r[invoiceColumn]
                                ).trim(),

                            bid:
                                String(
                                    r[bidColumn]
                                ).trim()

                        };

                    });

                resolve(mappingData);

            }

            catch(error){

                reject(error);

            }

        };

        reader.readAsArrayBuffer(file);

    });

}


// --------------------------------------------
// Detect Invoice column
// --------------------------------------------

function detectInvoiceColumn(headers){

    const keywords=[

        "invoice number",
        "invoice no",
        "invoice",
        "invoice_num",
        "invoice_num."

    ];

    for(const h of headers){

        const text=h.toLowerCase();

        if(

            keywords.some(
                k=>text.includes(k)
            )

        ){

            return h;

        }

    }

    return null;

}

// --------------------------------------------
// Detect BID column
// --------------------------------------------

function detectBidColumn(headers){

    for(const h of headers){

        if(

            h.toLowerCase().includes("bid")

        ){

            return h;

        }

    }

    return null;

}
