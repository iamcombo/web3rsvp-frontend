import { NextApiRequest, NextApiResponse } from "next";
import { Web3Storage, File, getFilesFromPath } from "web3.storage";
const { resolve } = require("path");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    return await storeEventData(req, res);
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

// Next, we'll create a new async function called storeEventData. 
// This function should try to get the event data from the request body and store the data, 
// and return an error if unsuccessful. Upon successful storage, 
// we are returning the cid that points to an IPFS directory of the file we just stored.

async function storeEventData(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  try {
    const files = await makeFileObjects(body);
    const cid = await storeFiles(files);
    return res.status(200).json({ success: true, cid: cid });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Error creating event", success: false });
  }
}

// Inside this function, there are two functions that will be called. 
// The first is an async function makeFileObjects. The purpose of this function is to create a json file that includes metadata passed from the req.body object. 
// The next function we call is the storeFiles function, which will store that json file to Web3.storage.

async function makeFileObjects(body: any) {
  const buffer = Buffer.from(JSON.stringify(body));

  const imageDirectory = resolve(process.cwd(), `public/images/${body.image}`);
  const files = await getFilesFromPath(imageDirectory);

  files.push(new File([buffer], "data.json"));
  console.log('====================================');
  console.log(files);
  console.log('====================================');
  return files;
}

async function storeFiles(files: any) {
  const client = makeStorageClient();
  const cid = await client.put(files);
  return cid;
}

function makeStorageClient() {
  return new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN as string });
}
