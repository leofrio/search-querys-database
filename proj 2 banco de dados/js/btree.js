/* Javascript program to construct a binary tree from
the given String */

/* A binary tree node has data, pointer to left
child and a pointer to right child */
class Node
{
	constructor()
	{
		this.data = 0;
		this.left = this.right = null;
	}
}

/* Helper function that allocates a new node */
function newNode(data)
{
	let node = new Node();
	node.data = data;
	node.left = node.right = null;
	return (node);
}

/* This function is here just to test */
function preOrder(node)
{
	if (node == null)
	return;
	console.log(node.data + " ");
	preOrder(node.left);
	preOrder(node.right);
}

// function to return the index of close parenthesis
function findIndex(str, si, ei)
{
	if (si > ei)
	return -1;

	// Inbuilt stack
	let s = [];
	for (let i = si; i <= ei; i++)
	{

	// if open parenthesis, push it
	if (str[i] == '(')
		s.push(str[i]);

	// if close parenthesis
	else if (str[i] == ')')
	{
		if (s[s.length-1] == '(')
		{
		s.pop();

		// if stack is empty, this is
		// the required index
		if (s.length == 0)
			return i;
		}
	}
	}

	// if not found return -1
	return -1;
}

// function to construct tree from String
function treeFromString(str,si,ei)
{
	// Base case
	if (si > ei)
	return null;

	let num = 0;
	// In case the number is having more than 1 digit
	while(si <= ei && str[si] >= '0' && str[si] <= '9')
	{
	num *= 10;
	num += (str[si] - '0');
	si++;
	}
	si--;
	// new root
	let root = newNode(num);
	let index = -1;

	// if next char is '(' find the index of
	// its complement ')'
	if (si + 1 <= ei && str[si + 1] == '(')
	index = findIndex(str, si + 1, ei);

	// if index found
	if (index != -1)
	{

	// call for left subtree
	root.left = treeFromString(str, si + 2, index - 1);

	// call for right subtree
	root.right
		= treeFromString(str, index + 2, ei - 1);
	}
	return root;
}

// This code is contributed by patel2127