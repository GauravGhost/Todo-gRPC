const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync('./todo.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
let todoService = protoDescriptor.TodoService;


// const todosProto = grpc.load('todo.proto'); //for older version

const server = new grpc.Server();

const todos = [
    {
        id: '1',
        title: 'Todo1',
        content: "First content is here"
    },
    {
        id: '2',
        title: 'Todo2',
        content: "Second content is here"
    }
]

server.addService(todoService.service, {
    listTodos: (call, callback) => {
        callback(null, {
            todos: todos
        });
    },
    createTodo: (call, callback) => {
        let incomingNewTodo = call.request
        todos.push(incomingNewTodo);
        callback(null, incomingNewTodo)
    },
    getTodo: (call, callback) => {
        let incomingTodoRequest = call.request
        let todoId = incomingTodoRequest.id;
        const response = todos.filter((todo) => todo.id == todoId);
        if (response.length > 0) {
            callback(null, response);
        } else {
            callback({
                message: "Todo not found!"
            }, null);
        }
    }
});


server.bindAsync('127.0.0.1:4000', grpc.ServerCredentials.createInsecure(), () => {
    console.log("Server Started")
    server.start();
});