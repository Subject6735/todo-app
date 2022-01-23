import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import moonImg from './images/icon-moon.svg';
import sunImg from './images/icon-sun.svg';
import crossImg from './images/icon-cross.svg';

class Header extends React.Component {
    handleClick = () => {
        this.props.handleClick();
    };

    render() {
        return (
            <header>
                <div>Todo</div>
                <img src={this.props.isDark ? sunImg : moonImg} alt={this.props.isDark ? 'sun' : 'moon'} onClick={this.handleClick} />
            </header>
        );
    }
}

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.handleLoad = this.handleLoad.bind(this);
        this.state = {
            todos: [],
            completed: [],
            displayCross: [],

            filteredTodos: [],
            filteredCompleted: [],

            displayAll: true,
            displayActive: false,
            displayCompleted: false,
        };
    }

    toggleCross(i, val) {
        this.setState((state) => {
            return {
                displayCross: state.displayCross.map((e, ind) => (ind === i ? val : e)),
            };
        });
    }

    toggleCheck(i) {
        const originalIndex = this.state.todos.findIndex((e) => e === this.state.filteredTodos[i]);

        this.setState(
            (state) => {
                return {
                    displayCross: Array(state.displayCross.length).fill(false),
                    completed: state.completed.map((e, ind) => (ind === originalIndex ? !e : e)),

                    filteredCompleted: state.completed.map((e, ind) => (ind === originalIndex ? !e : e)),
                };
            },
            () => {
                this.setFilter();
                localStorage.setItem('todoData', JSON.stringify(this.state));
            }
        );
    }

    addTodo() {
        const val = document.querySelector('#todoText').value.toString();

        if (val !== '') {
            this.setState(
                (state) => {
                    return {
                        todos: state.todos.concat([val]),
                        completed: state.completed.concat([false]),
                        displayCross: state.displayCross.concat([false]),

                        filteredTodos: state.filteredTodos.concat([val]),
                        filteredCompleted: state.filteredCompleted.concat([false]),
                    };
                },
                () => {
                    this.setFilter();
                    localStorage.setItem('todoData', JSON.stringify(this.state));
                }
            );
        }

        document.querySelector('#todoText').value = '';
    }

    removeTodo(i) {
        const originalIndex = this.state.todos.findIndex((e) => e === this.state.filteredTodos[i]);

        this.setState(
            (state) => {
                return {
                    todos: state.todos.filter((e, ind) => originalIndex !== ind),
                    completed: state.completed.filter((e, ind) => originalIndex !== ind),
                    displayCross: state.displayCross.filter((e, ind) => originalIndex !== ind),

                    filteredTodos: state.todos.filter((e, ind) => originalIndex !== ind),
                    filteredCompleted: state.completed.filter((e, ind) => originalIndex !== ind),
                };
            },
            () => {
                this.setFilter();
                localStorage.setItem('todoData', JSON.stringify(this.state));
            }
        );
    }

    removeCompleted() {
        const completedInds = this.state.completed.map((e, i) => (!e ? i : null)).filter((e) => e !== null);

        this.setState(
            (state) => {
                return {
                    todos: state.todos.filter((e, ind) => completedInds.includes(ind)),
                    completed: state.completed.filter((e, ind) => completedInds.includes(ind)),
                    displayCross: state.displayCross.filter((e, ind) => completedInds.includes(ind)),

                    filteredTodos: state.todos.filter((e, ind) => completedInds.includes(ind)),
                    filteredCompleted: state.completed.filter((e, ind) => completedInds.includes(ind)),
                };
            },
            () => {
                this.setFilter();
                localStorage.setItem('todoData', JSON.stringify(this.state));
            }
        );
    }

    displayAll() {
        this.setState(
            (state) => {
                return {
                    displayAll: true,
                    displayActive: false,
                    displayCompleted: false,
                    filteredTodos: state.todos,
                    filteredCompleted: state.completed,
                };
            },
            () => {
                localStorage.setItem('todoData', JSON.stringify(this.state));
            }
        );
    }

    displayActive() {
        this.setState(
            (state) => {
                return {
                    displayAll: false,
                    displayActive: true,
                    displayCompleted: false,
                    filteredTodos: state.completed.map((e, i) => (!e ? state.todos[i] : null)).filter((e) => e !== null),
                    filteredCompleted: state.completed.map((e, i) => (!e ? e : null)).filter((e) => e !== null),
                };
            },
            () => {
                localStorage.setItem('todoData', JSON.stringify(this.state));
            }
        );
    }

    displayCompleted() {
        this.setState(
            (state) => {
                return {
                    displayAll: false,
                    displayActive: false,
                    displayCompleted: true,
                    filteredTodos: state.completed.map((e, i) => (e ? state.todos[i] : null)).filter((e) => e !== null),
                    filteredCompleted: state.completed.map((e, i) => (e ? e : null)).filter((e) => e !== null),
                };
            },
            () => {
                localStorage.setItem('todoData', JSON.stringify(this.state));
            }
        );
    }

    setFilter() {
        if (this.state.displayAll) {
            this.displayAll();
        } else if (this.state.displayActive) {
            this.displayActive();
        } else if (this.state.displayCompleted) {
            this.displayCompleted();
        } else return;
    }

    handleLoad() {
        const data = localStorage.getItem('todoData');
        if (data) {
            this.setState(JSON.parse(data));
        }
    }

    handleDragStart(e) {
        e.target.classList.add('dragging');
    }

    handleDragEnd(e, i) {
        /*const current = e.target.querySelector('.todo').innerHTML;
        const next = e.target.nextElementSibling.querySelector('.todo').innerHTML;

        const updatedTodos = this.state.todos;
        const index = updatedTodos.findIndex((e) => e === next);

        updatedTodos.splice(i, 1);
        updatedTodos.splice(index, 0, current);*/

        /*this.setState(
            (state) => {
                return {
                    todos: updatedTodos,
                    completed: state.completed,
                    displayCross: state.displayCross,

                    filteredTodos: state.filteredTodos,
                    filteredCompleted: state.filteredCompleted,
                };
            },
            () => {
                this.setFilter();
                localStorage.setItem('todoData', JSON.stringify(this.state));
            }
        );*/

        e.target.classList.remove('dragging');
    }

    handleDragOver(e) {
        e.preventDefault();

        const list = document.querySelector('.todoList');
        const afterElement = this.getAfterDragElement(list, e.clientY);
        const draggableItem = document.querySelector('.dragging');

        if (afterElement === null) {
            list.appendChild(draggableItem);
        } else {
            list.insertBefore(draggableItem, afterElement);
        }
    }

    getAfterDragElement(list, y) {
        const draggableElements = [...list.querySelectorAll('.todoItem:not(.dragging)')];

        return draggableElements.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;
                if (offset < 0 && offset > closest.offset) {
                    return {offset: offset, element: child};
                } else {
                    return closest;
                }
            },
            {offset: Number.NEGATIVE_INFINITY}
        ).element;
    }

    componentDidMount() {
        window.addEventListener('load', this.handleLoad);
    }

    componentWillUnmount() {
        window.removeEventListener('load', this.handleLoad);
    }

    render() {
        return (
            <main>
                <div className="outerWrapper">
                    <div className="addTodo">
                        <div className="checkCircle" onClick={() => this.addTodo()}></div>
                        <input className="todoInp" id="todoText" placeholder={'Create a new todo...'} autoComplete="off" />
                    </div>
                    <div className="todos">
                        <ul className="todoList">
                            {this.state.filteredTodos.map((name, i) => {
                                return (
                                    <li
                                        key={i}
                                        className={`todoItem ${this.state.filteredCompleted[i] ? 'completed' : ''}`}
                                        onMouseOver={() => this.toggleCross(i, true)}
                                        onMouseOut={() => this.toggleCross(i, false)}
                                        onDragStart={(e) => this.handleDragStart(e)}
                                        onDragEnd={(e) => this.handleDragEnd(e, i)}
                                        onDragOver={(e) => this.handleDragOver(e)}
                                        draggable="true"
                                    >
                                        <div className="checkCircle" onClick={() => this.toggleCheck(i)}></div>
                                        <div className="todo">{name}</div>
                                        <img
                                            src={crossImg}
                                            alt="cross"
                                            className="cross"
                                            style={{
                                                display: this.state.displayCross[i] ? 'block' : 'none',
                                            }}
                                            onClick={() => this.removeTodo(i)}
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="statusbar">
                            <div>
                                {this.state.completed.filter((e) => !e).length}{' '}
                                {this.state.completed.filter((e) => !e).length === 1 ? 'item' : 'items'} left
                            </div>
                            <div className="filter">
                                <span className={this.state.displayAll ? 'active' : ''} onClick={() => this.displayAll()}>
                                    All
                                </span>
                                <span className={this.state.displayActive ? 'active' : ''} onClick={() => this.displayActive()}>
                                    Active
                                </span>
                                <span className={this.state.displayCompleted ? 'active' : ''} onClick={() => this.displayCompleted()}>
                                    Completed
                                </span>
                            </div>
                            <div className="clear" onClick={() => this.removeCompleted()}>
                                Clear Completed
                            </div>
                        </div>
                    </div>
                    <div className="dragNDropInfo">Drag and drop to reorder list</div>
                </div>
            </main>
        );
    }
}

function Footer() {
    return (
        <footer>
            <div className="attribution">
                Challenge by{' '}
                <a href="https://www.frontendmentor.io?ref=challenge" target="_blank" rel="noreferrer">
                    {' '}
                    Frontend Mentor
                </a>
                . Coded by{' '}
                <a href="https://github.com/Subject6735" target="_blank" rel="noreferrer">
                    {' '}
                    Deme Maráki
                </a>
                .
            </div>
        </footer>
    );
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleLoad = this.handleLoad.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            isDark: false,
        };
    }

    handleClick = () => {
        this.setState({
            isDark: !this.state.isDark,
        });
        localStorage.setItem('isDark', !this.state.isDark);
    };

    handleLoad() {
        const isDark = localStorage.getItem('isDark');
        if (isDark) {
            this.setState({
                isDark: JSON.parse(isDark),
            });
        }
    }

    componentDidMount() {
        window.addEventListener('load', this.handleLoad);
    }

    componentWillUnmount() {
        window.removeEventListener('load', this.handleLoad);
    }

    render() {
        let theme = this.state.isDark ? 'dark' : 'light';

        if (theme === 'dark') {
            document.body.classList.remove('light');
            document.body.classList.add('dark');
        } else {
            document.body.classList.add('light');
            document.body.classList.remove('dark');
        }

        return (
            <div className={`mainlayout ${this.state.isDark ? 'dark' : 'light'}`}>
                <Header isDark={this.state.isDark} handleClick={this.handleClick} />
                <Main />
                <Footer />
            </div>
        );
    }
}

ReactDOM.render(<App />, document.querySelector('#root'));
