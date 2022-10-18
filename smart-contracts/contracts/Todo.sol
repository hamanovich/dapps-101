// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Todo {
    event AddTask(address recepient, uint256 taskId);
    event DeleteTask(uint256 taskId, bool isDeleted);

    struct Task {
        uint256 id;
        string taskText;
        bool isDeleted;
    }

    Task[] private tasks;
    mapping(uint256 => address) taskToOwner;

    modifier onlyOwner(uint256 index) {
        require(taskToOwner[index] == msg.sender, "Not an owner task");
        _;
    }

    function addTask(string memory taskText) external {
        uint256 taskId = tasks.length;
        tasks.push(Task(taskId, taskText, false));
        taskToOwner[taskId] = msg.sender;
        emit AddTask(msg.sender, taskId);
    }

    function getAllTasks() external view returns (Task[] memory) {
        Task[] memory temp = new Task[](tasks.length);
        uint256 counter;

        for (uint256 i; i < tasks.length; i++) {
            if (taskToOwner[i] == msg.sender && tasks[i].isDeleted == false) {
                temp[counter] = tasks[i];
                counter++;
            }
        }

        Task[] memory result = new Task[](counter);

        for (uint256 i; i < counter; i++) {
            result[i] = temp[i];
        }

        return result;
    }

    function deleteTask(uint256 taskId) external onlyOwner(taskId) {
        tasks[taskId].isDeleted = true;
        emit DeleteTask(taskId, true);
    }
}
