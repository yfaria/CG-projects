function to_complex(x) {
    s = new Array(x.length);
    for (let i = 0; i < x.length; i++)
	s[i] = [x[i], 0];
    return s;
}

function IBR(N, NU){
    let x = 0;
    for (let i = 0; i < NU; i++) {
	let c = N >> 1;
	x = (x << 1) + (N - (c << 1));
	N = c;
    }
    return x;
}

function getRoundSquare(n) {
    let i = 0;
    let m = n;
    while (m != 1) {
	m = m >> 1;
        i++;
    }
    if (n == (1 << i))
        return i;
    return i+1;
}
    
function complexUnityRoots(num) {
    //sai um W de tal modo que W[k] = exp((-2 * pi * i/ N) * k)
    let W = Array(num);
    for (let i = 0; i < (num >> 2); i++) {
	W[i] = [Math.cos(2*Math.PI*i/num), Math.sin(2*Math.PI*i/num)];
	W[i + (num >> 1)] = [-W[i][0], -W[i][1]];
	W[i + (num >> 2)] = [-W[i][1], W[i][0]];
	W[i + (num >> 2) + (num >> 1)] = [-W[i + (num >> 2)][0], -W[i + (num >> 2)][1]];
    }
    return [W[0]].concat(W.slice(1).reverse());
}

function FFT(x) {
    let N = x.length;
    let y = to_complex(x);
    let W = complexUnityRoots(N);
    let NU = getRoundSquare(N);
    let N2 = N >> 1;
    let NU1 = NU - 1;
    let k = 0;
    for (let l = 0; l < NU; l++) {
	while (k < N-1) {
	    for (let i = 0; i < N2; i++) {
		let M = k >> NU1; // (int(k/2**NU1))
		let P = IBR(M, NU);
		//T1 = W[P] * y[k+N2]
//		console.log(y[k+N2]);
//		console.log(W[P]);
		let T1 = [W[P][0] * y[k+N2][0] - W[P][1] * y[k+N2][1],
			  W[P][0] * y[k+N2][1] + W[P][1] * y[k+N2][0]];
//		console.log(T1);
		y[k+N2] = [y[k][0] - T1[0],
			   y[k][1] - T1[1]];
		y[k] = [y[k][0] + T1[0],
			y[k][1] + T1[1]];
		k++;
	    }
	    k += N2;
	}
	N2 >>= 1;
	NU1 -= 1;
	k = 0;
    }
    while (k != N-1) {
	let i = IBR(k,NU);
	if (i < k) {
	    T1 = y[k];
	    y[k] = y[i];
	    y[i] = T1;
	}
	k++;
    }
    return y;
}

//criando array de teste e desenhando as raízes da unidade.
var W = complexUnityRoots(8);
var ru = document.getElementById("ru");

for (let i = 0; i < W.length; i++) {
    let root = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    root.setAttribute('cx', 200*W[i][0] + 250);
    root.setAttribute('cy', 200*W[i][1] + 250);
    root.setAttribute('r', 5);
    root.setAttribute('stroke', 'black');
    root.setAttribute('stroke-width', '2');
    root.setAttribute('fill','blue');
    ru.appendChild(root);
}


var entr = [1,2,3,4,5,6,7,8];
let tes = document.getElementById("fft");
//1º coluna
for (let i = 0; i < entr.length; i++) {
    let root = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    root.setAttribute('cx', 100);
    root.setAttribute('cy', 30 + 45*i);
    root.setAttribute('r', 5);
    root.setAttribute('id', 'a'+i);
    root.setAttribute('stroke', 'black');
    root.setAttribute('stroke-width', '2');
    root.setAttribute('fill','blue');
    tes.appendChild(root);
    root = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    console.log(root);
    root.innerHTML = entr[i];
    root.setAttribute('x', 95);
    root.setAttribute('y', 20 + 45*i);
    tes.appendChild(root);
}
var N = entr.length;
var k = 0;
var l = 0;
var y = to_complex(entr);
var NU = getRoundSquare(N);
var N2 = N >> 1;
var NU1 = NU - 1;

var button_control = document.getElementById("next");
button_control.addEventListener("click", function () {
    if (l < NU) {
    //cria nova coluna e as linhas:
	while (k < N-1) {
	    for (let i = 0; i < N2; i++) {
		let M = k >> NU1;
		let P = IBR(M, NU);
		let T1 = [W[P][0] * y[k+N2][0] - W[P][1] * y[k+N2][1],
			  W[P][0] * y[k+N2][1] + W[P][1] * y[k+N2][0]];
		y[k+N2] = [y[k][0] - T1[0],
			   y[k][1] - T1[1]];
		y[k] = [y[k][0] + T1[0],
			y[k][1] + T1[1]];
		root = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		root.setAttribute('cx', 100+100*(l+1));
		root.setAttribute('cy', 30 + 45*k);
		root.setAttribute('r', 5);
		root.setAttribute('id', 'a'+l+k);
		root.setAttribute('stroke', 'black');
		root.setAttribute('stroke-width', '2');
		root.setAttribute('fill','blue');
		tes.appendChild(root);
		root = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		root.innerHTML = y[k][0] +  " " + y[k][1] + "j";
		root.setAttribute('x', 95 + 100*(l+1));
		root.setAttribute('y', 15 + 45*k);
		tes.appendChild(root);
root = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		root.setAttribute('cx', 100+100*(l+1));
		root.setAttribute('cy', 30 + 45*(k+N2));
		root.setAttribute('r', 5);
		root.setAttribute('id', 'a'+l+(k+N2));
		root.setAttribute('stroke', 'black');
		root.setAttribute('stroke-width', '2');
		root.setAttribute('fill','blue');
		tes.appendChild(root);
		root = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		root.innerHTML = y[k+N2][0] + " + j " + y[k+N2][1];
		root.setAttribute('x', 95 + 100*(l+1));
		root.setAttribute('y', 15 + 45*(k+N2));
		tes.appendChild(root);	
		root = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		root.setAttribute('x1',100 + + 100*l);
		root.setAttribute('y1',30 + 45*k);
		root.setAttribute('x2',100 + + 100*(l+1));
		root.setAttribute('y2',30 + 45*k);
		root.setAttribute('style','stroke:rgb(50,50,50);stroke-width:2');
		tes.appendChild(root);
		root = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		root.setAttribute('x1',100 + + 100*l);
		root.setAttribute('y1',30 + 45*(k+N2));
		root.setAttribute('x2',100 + + 100*(l+1));
		root.setAttribute('y2',30 + 45*(k+N2));
		root.setAttribute('style','stroke:rgb(50,50,50);stroke-width:2');
		tes.appendChild(root);
		root = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		root.setAttribute('x1',100 + + 100*l);
		root.setAttribute('y1',30 + 45*k);
		root.setAttribute('x2',100 + + 100*(l+1));
		root.setAttribute('y2',30 + 45*(k+N2));
		root.setAttribute('style','stroke:rgb(50,50,50);stroke-width:2');
		tes.appendChild(root);
		root = document.createElementNS('http://www.w3.org/2000/svg', 'line');
		root.setAttribute('x1',100 + + 100*l);
		root.setAttribute('y1',30 + 45*(k+N2));
		root.setAttribute('x2',100 + + 100*(l+1));
		root.setAttribute('y2',30 + 45*k);
		root.setAttribute('style','stroke:rgb(50,50,50);stroke-width:2');
		tes.appendChild(root);
		
		k++;
	    }
	    k += N2;
	}
	N2 >>= 1;
	NU1 -= 1;
	k = 0;
	l++;
	console.log(y);
    }
});
			  

/*
function rec_fft(x) {
    let n = x.length;
    let W = complexUnityRoots(n);
    let y = to_complex(x)
    return aux_rec_fft(y, 0, W);
}

function aux_rec_fft(x, k, W) {
    //x dá está na forma [a,b] = a + jb.
    let n = x.length;
    if (n == 1) {
	return x;
    } else {
	let pares = new Array(n >> 1);
	let impares = new Array(n >> 1);
	for (let i = 0; i < (n >> 1); i++) {
	    pares[i] = x[i << 1];
	    impares[i] = x[(i << 1) + 1];
	}
	let fp = aux_rec_fft(pares, k+1, W);
	let fi = aux_rec_fft(impares, k+1, W);
	console.log(fp);
	console.log(fi);
	let X = new Array(n);
	console.log(X.length);
	for (let j = 0; j < (n >> 1); j++) {
	    X[j << 1] = fp[j];
	    X[(j << 1) + 1] = fi[j];
	}
	console.log(X);
	for (let j = 0; j < (n >> 1); j++) {
	    let t = X[j];
	    console.log(t);
	    // X[j] = t + W[(W.length/n) * k] * X[j + (n >> 1)];
	    X[j] =
		[ t[0] + W[(W.length/n) * j][0] * X[j + (n >> 1)][0] -
		  W[(W.length/n) * k][1] * X[j + (n >> 1)][1],
		  t[1] + W[(W.length/n) * j][1] * X[j + (n >> 1)][0] +
		  W[(W.length/n) * j][0] * X[j + (n >> 1)][1]];
	    console.log(X[k]);
	    // X[j+(n >> 1)] = t - W[(W.length/n) * k] * X[j + (n >> 1)];
	    X[j + (n >> 1)] =
		[ t[0] - W[(W.length/n) * j][0] * X[j + (n >> 1)][0] +
		  W[(W.length/n) * j][1] * X[j + (n >> 1)][1],
		  t[1] - W[(W.length/n) * j][1] * X[j + (n >> 1)][0] -
		  W[(W.length/n) * j][0] * X[j + (n >> 1)][1] ];
	}
	return X;
    }
}
*/
