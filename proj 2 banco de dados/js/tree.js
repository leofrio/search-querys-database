function drawCircle(ctx, x, y, radius, color='black') {
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
}

function drawText(ctx, x, y, text, font='Arial', fontSize=20, color='red', margin=0) {
    const textLines = text.split('\n');
    const height = (textLines.length * fontSize) + ((textLines.length-1) * margin);
    ctx.font = fontSize + 'px ' + font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    for (let i = 0; i < textLines.length; i++) {
        ctx.fillText(textLines[i], x, y-(height/4)+((margin + fontSize)*i));
    }
}

function drawLine(ctx, x1, y1, x2, y2, width=10, color='black') {
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
}

class TreeNode {
    constructor(value, parent=null) {
        this.value = value;
        this.children = [];
        this.parent = parent;
        this.coord = {x: 0, y: 0}
    }

    addChild(node) {
        this.children.push(node);
    }

    setCoord(x, y) {
        this.coord.x = x;
        this.coord.y = y;
    }
}

class Tree {
    constructor() {
        this.root = null;
    }

    addNode(value, parentValue) {
        const node = new TreeNode(value, parentValue);
        if (this.root === null) {
            this.root = node;
            return;
        }
        this.traverse((currentNode) => {
            if (currentNode.value === parentValue) {
                currentNode.addChild(node);
            }
        });
        if (this.root === null) {
            this.root = new TreeNode(value, null);
        }
    }

    traverse(callback) {
        const queue = [this.root];
        while (queue.length) {
            const node = queue.shift();
            callback(node);
            for (let child of node.children) {
                queue.push(child);
            }
        }
    }

    getNode(value) {
        const queue = [this.root];
        while (queue.length) {
            const node = queue.shift();
            if (node.value === value) {
                return node;
            }
            for (let child of node.children) {
                queue.push(child);
            }
        }
    }

    generate(str) {
        str = str.replace(/\s*=\s*/g, "=");
        str = str.replace(/\s*,\s*/g, ",");

        let r = [];
        const regex = /\(([^()]+)\)/g;
        while (str.includes("(") && str.includes(")")) {
            const matches = str.match(regex);
            for (let m of matches) {
                str = str.replace(m, `{${r.length}}`);
                r.push(m);
            }
        }
        console.log(r);
        for (let i = 0; i < r.length; i++) {
            const reg = /^\(\{\d+\}\)$/
            if (reg.test(r[i])) r.splice(i, 1);
        }
        console.log(r);
        this._rGenerate(r);
    }

    _rGenerate(r, n=null, p=null) {
        const regex2 = /\{([^{}]+)\}/g;
        let node = r.pop(n);
        const children = node.match(regex2);
        node = node.replace(regex2, '').replace('(', '').replace(')', '').trim().replace(' ', '\n');
        this.addNode(`${node}`, `${p}`);
        if (children) {
            for (let c of children) {
                c = c.slice(1,-1);
                this._rGenerate(r, r[parseInt(c)], node);
            }
        }
    }

    draw(canvas, margin=100) {
        const ctx = canvas.getContext('2d');
        let currentCoord = {x: margin, y: margin};
        let lastCoord = {x: 0, y: 0}
        const moveLeft = () => { 
            currentCoord.x -= margin;
            // drawCircle(ctx, currentCoord.x, currentCoord.y, 5, 'red');
        };
        const moveRight = () => { 
            currentCoord.x += margin;
            // drawCircle(ctx, currentCoord.x, currentCoord.y, 5, 'red');
        };
        const moveUp = () => { 
            currentCoord.y -= margin;
            // drawCircle(ctx, currentCoord.x, currentCoord.y, 5, 'red');
        };
        const moveDown = () => { 
            currentCoord.y += margin;
            // drawCircle(ctx, currentCoord.x, currentCoord.y, 5, 'red');
        };
        const drawNode = (n) => {
            drawCircle(ctx, n.coord.x, n.coord.y, 30);
            drawText(ctx, n.coord.x, n.coord.y, n.value);
        }
        let parentStack = [];
        
        const stack = [this.root];
        while (stack.length) {
            const node = stack.pop();

            // drawing ---------------------------------------------------------------------------------
            if (node === this.root) {
                parentStack.push(node);
                node.setCoord(currentCoord.x, currentCoord.y);
                drawNode(node);
            }
            else {
                while (node.parent !== parentStack[parentStack.length-1].value && parentStack.length) {
                    moveLeft();
                    parentStack.pop();
                    drawLine(ctx, currentCoord.x, currentCoord.y, parentStack[parentStack.length-1].coord.x, parentStack[parentStack.length-1].coord.y);
                }
    
                if (!parentStack.length) {
                    console.error("Traverse error");
                    return;
                }
    
                lastCoord = {...currentCoord}
                moveDown();
                drawLine(ctx, lastCoord.x, lastCoord.y, currentCoord.x, currentCoord.y);
                lastCoord = {...currentCoord};
                moveRight();
                drawLine(ctx, lastCoord.x, lastCoord.y, currentCoord.x, currentCoord.y);
                node.setCoord(currentCoord.x, currentCoord.y);
                drawNode(node);
                if (node.children.length) {
                    parentStack.push(node);
                }
                else {
                    moveLeft();
                }
            }
            // -----------------------------------------------------------------------------------------

            for (let child of node.children) {
                stack.push(child);
            }
        }
    }
}
  