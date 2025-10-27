
let sock = null;

async function setSock(newSock) {
  sock = newSock;
}

async function clearSock() {
  sock = null;
}

export { sock, setSock, clearSock };