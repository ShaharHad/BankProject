export const formatTimestamp = (timestamp) =>{
    return new Date(timestamp * 1000).toISOString().slice(0, 19).replace("T", " ");
}
