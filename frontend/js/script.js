const expenseForm = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const totalAmountEl = document.getElementById('total-amount');
const apiUrl = 'http://localhost:3030/despesas';

// Função para buscar todas as despesas e exibi-las
async function fetchExpenses() {
    const response = await fetch(apiUrl);
    const expenses = await response.json();

    expenseList.innerHTML = '';

    expenses.forEach(expense => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${expense.description} - R$ ${expense.amount.toFixed(2)} - ${new Date(expense.date).toLocaleDateString()}</span>
            <div class="actions">
                <button class="edit" onclick="editExpense('${expense._id}')">Editar</button>
                <button class="delete" onclick="deleteExpense('${expense._id}')">Excluir</button>
            </div>
        `;
        expenseList.appendChild(li);
    });

    fetchTotalExpenses();
}

// Função para calcular o total de despesas
async function fetchTotalExpenses() {
    const response = await fetch(`${apiUrl}/total`);
    const { total } = await response.json();
    totalAmountEl.textContent = total.toFixed(2);
}

// Função para adicionar uma nova despesa
expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, amount, date })
    });

    if (response.ok) {
        fetchExpenses();
        expenseForm.reset();
    } else {
        alert('Erro ao adicionar despesa.');
    }
});

// Função para editar uma despesa
async function editExpense(id) {
    const description = prompt('Nova descrição:');
    const amount = parseFloat(prompt('Novo valor:'));
    const date = prompt('Nova data (dd/mm/yyyy):');

    // Converter data do formato dd/mm/yyyy para ISO (yyyy-mm-dd)
    const [day, month, year] = date.split('/');
    const isoDate = `${year}-${month}-${day}`;

    const response = await fetch(`${apiUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, amount, date: isoDate })
    });

    if (response.ok) {
        fetchExpenses();
    } else {
        alert('Erro ao editar despesa.');
    }
}

// Função para excluir uma despesa
async function deleteExpense(id) {
    const response = await fetch(`${apiUrl}/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        fetchExpenses();
    } else {
        alert('Erro ao excluir despesa.');
    }
}

// Inicialização
fetchExpenses();
