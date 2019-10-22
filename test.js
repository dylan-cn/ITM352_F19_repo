

//let pieces = [ 'Dylan', 25, 25 + 0.5, 0.5 - 25 ];


let attributes = "Dylan;25;MIS";
let pieces = attributes.split(";");
pieces.forEach(x => console.log(x));

console.log(pieces.join(';'));