// Intro animation
let intro = document.querySelector('.Intro');
let logoItems = document.querySelectorAll('.logo-item');

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        logoItems.forEach((item, idx) => {
            setTimeout(() => {
                item.classList.add('active');
            }, idx * 100);
        });

        setTimeout(() => {
            logoItems.forEach((item, idx) => {
                setTimeout(() => {
                    item.classList.remove('active');
                    item.classList.add('fade');
                }, idx * 50);
            });
        }, 700);

        setTimeout(() => {
            intro.classList.add('hide');
        }, 1200);
    }, 100);

    renderCode();
});

// Scroll to top on page load
window.onload = function() {
    window.scrollTo(0, 0);
};
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
}

// ─────────────────────────────────────────────
// Source code (syntax highlighted)
// ─────────────────────────────────────────────
const rawCode = `# Assessment 2
import time
print ("\\n\\t Vending Machine, Please wait...")
time.sleep(2.2)
menu = {"A1": {"ItemName": 'Water',        "itemPrice": 1.00},
        "A2": {"ItemName": 'Coca cola',    "ItemPrice": 2.40},
        "A3": {"ItemName": 'Fanta',        "ItemPrice": 2.36},
        "B1": {"ItemName": 'Kitkat',       "ItemPrice": 1.95},
        "B2": {"ItemName": 'Lays chips',   "ItemPrice": 7.49},
        "B3": {"ItemName": 'Vimto',        "ItemPrice": 2.00},
        "C1": {"ItemName": 'Oman chips',   "ItemPrice": 3.00},
        "C2": {"ItemName": '7 days bread', "ItemPrice": 1.70},
        "C3": {"ItemName": 'Doritos',      "ItemPrice": 8.95}}

print ('  ======================================')
print ("  ||Welcome to Lanz's Vending Machine!||")
print ('  ======================================')

def menu_items():
    print("\\n\\t\\t\\tHere's our menu")
    print('\\n============================================')
    for code, details in menu.items():
        item_name  = details["ItemName"]
        item_price = details.get("ItemPrice") or details.get("itemPrice")
        print(f"Code: {code} | Item: {item_name:12} | Price: \${item_price:.2f}")
    print('============================================')

balance = 0

def cash_insert():
    global balance
    while True:
        try:
            input_cash = float(input("\\nInsert cash (1-100 bills only): "))
            if 1 <= input_cash <= 100:
                balance += input_cash
                print(f"\\nYour balance is {balance} dhs")
                break
            else:
                print("\\nInvalid amount! Please enter cash between 1 and 100.")
        except ValueError:
            print("\\nInvalid input. Please enter a number.")

def order():
    global balance, price, item_name
    print ("\\n\\t\\t\\tPlease wait..")
    print ('\\n\\t--- Order Process Started ---')
    consumer = input("\\nPlease select your item code (Example: A1): ").strip().capitalize()
    if consumer not in menu:
        print ("\\nInvalid Item code. Please try again!")
        return
    item_details = menu[consumer]
    item_name = item_details.get("ItemName")
    price = item_details.get("ItemPrice") or item_details.get("itemPrice")
    while True:
        insert_cash = input(f"\\nYour current balance is {balance}\\n\\nWould you like to add money?(Y/N): ").strip().capitalize()
        if insert_cash == 'Y':
            cash_insert()
            payment()
            break
        elif insert_cash == 'N':
            payment()
            break
        else:
            print ("\\nThat's not a proper input. Please try again")

def payment():
    global balance, price, item_name
    if balance < price:
        print ("\\nYou don't have enough in your balance please insert cash")
        cash_insert()
    pay = input("\\nPlease confirm your purchase (Y/N): ").strip().capitalize()
    if pay == "Y":
        balance = balance - price
        print (f"\\nHere's your {item_name}! \\nYour current balance is {balance} dhs")
        continue_shopping()
    elif pay == 'N':
        print ("\\n\\tPayment cancelled.")
        continue_shopping()

def continue_shopping():
    global balance
    onwards = input("\\nWould you like to continue shopping?(Y/N): ").strip().capitalize()
    if onwards == 'Y':
        menu_items()
        order()
    elif onwards == 'N':
        print (f"\\nHave a great day! \\n\\nHere's your {balance} dhs back!")
    else:
        print ("\\nThat's not a proper input. Please try again")
        continue_shopping()

menu_items()
order()`;

function highlight(code) {
    return code
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        .replace(/(#.*)/g, '<span class="cm">$1</span>')
        .replace(/\b(import|def|global|while|if|elif|else|return|for|in|try|except|break|not|and|or)\b/g, '<span class="kw">$1</span>')
        .replace(/\b(print|input|float|len|str|int|True|False|None)\b/g, '<span class="bi">$1</span>')
        .replace(/(f?["'](?:[^"'\\]|\\.)*["'])/g, '<span class="str">$1</span>')
        .replace(/\b(\d+\.?\d*)\b/g, '<span class="num">$1</span>');
}

function renderCode() {
    document.getElementById('code-display').innerHTML = highlight(rawCode);
}

function copyCode() {
    navigator.clipboard.writeText(rawCode).then(() => {
        const btn = document.querySelector('.copy-btn');
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy', 2000);
    });
}

// ─────────────────────────────────────────────
// Modal open / close / tabs
// ─────────────────────────────────────────────
function openVendingModal() {
    document.getElementById('vm-modal').classList.add('open');
    document.body.style.overflow = 'hidden';
    switchTab('code', document.querySelector('.vm-tab'));
}

function closeVendingModal(event, force = false) {
    if (force || event.target === document.getElementById('vm-modal')) {
        document.getElementById('vm-modal').classList.remove('open');
        document.body.style.overflow = '';
    }
}

function switchTab(tab, btn) {
    document.querySelectorAll('.vm-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.vm-panel').forEach(p => p.classList.add('hidden'));
    document.getElementById('panel-' + tab).classList.remove('hidden');
    if (tab === 'sim' && simState === 'idle') startSim();
}

// ─────────────────────────────────────────────
// Vending Machine Simulator (JS re-implementation)
// ─────────────────────────────────────────────
const menu = {
    "A1": { name: "Water",        price: 1.00 },
    "A2": { name: "Coca Cola",    price: 2.40 },
    "A3": { name: "Fanta",        price: 2.36 },
    "B1": { name: "Kitkat",       price: 1.95 },
    "B2": { name: "Lays Chips",   price: 7.49 },
    "B3": { name: "Vimto",        price: 2.00 },
    "C1": { name: "Oman Chips",   price: 3.00 },
    "C2": { name: "7 Days Bread", price: 1.70 },
    "C3": { name: "Doritos",      price: 8.95 }
};

let simState   = 'idle';   // idle | menu | order | ask_add_money | insert_cash | confirm_pay | shopping_again | done
let balance    = 0;
let selectedItem = null;
let inputQueue = [];

function out(text, cls = '') {
    const el = document.getElementById('terminal-output');
    const line = document.createElement('div');
    if (cls) line.className = cls;
    line.textContent = text;
    el.appendChild(line);
    el.scrollTop = el.scrollHeight;
}

function printMenu() {
    out("");
    out("\t\t\tHere's our menu", 't-line-purple');
    out("");
    out("============================================");
    for (const [code, item] of Object.entries(menu)) {
        out(`Code: ${code} | Item: ${item.name.padEnd(12)} | Price: $${item.price.toFixed(2)}`);
    }
    out("============================================");
}

function startSim() {
    simState = 'menu';
    balance = 0;
    selectedItem = null;
    out(" Vending Machine, Please wait...", 't-line-yellow');

    setTimeout(() => {
        out("");
        out("  ======================================");
        out("  ||Welcome to Lanz's Vending Machine!||", 't-line-green');
        out("  ======================================");
        printMenu();
        out("");
        out("\t--- Order Process Started ---", 't-line-purple');
        out("");
        out("Please select your item code (Example: A1):", 't-line-yellow');
        simState = 'order';
    }, 600);
}

function resetSim() {
    document.getElementById('terminal-output').innerHTML = '';
    simState = 'idle';
    balance = 0;
    selectedItem = null;
    document.getElementById('t-input').value = '';
    startSim();
}

function handleInput(e) {
    if (e.key !== 'Enter') return;
    const raw = document.getElementById('t-input').value.trim();
    document.getElementById('t-input').value = '';
    if (!raw) return;

    out('$ ' + raw, 't-line-echo');

    const val = raw.toUpperCase();

    if (simState === 'order') {
        if (menu[val]) {
            selectedItem = menu[val];
            out(`\nSelected: ${selectedItem.name} — $${selectedItem.price.toFixed(2)}`, 't-line-green');
            out(`\nYour current balance is ${balance.toFixed(2)} dhs`);
            out("\nWould you like to add money? (Y/N):", 't-line-yellow');
            simState = 'ask_add_money';
        } else {
            out("\nInvalid item code. Please try again!", 't-line-red');
            out("Please select your item code (Example: A1):", 't-line-yellow');
        }

    } else if (simState === 'ask_add_money') {
        if (val === 'Y') {
            out("\nInsert cash (1-100 bills only):", 't-line-yellow');
            simState = 'insert_cash';
        } else if (val === 'N') {
            tryPayment();
        } else {
            out("\nThat's not a proper input. Please try again", 't-line-red');
            out("Would you like to add money? (Y/N):", 't-line-yellow');
        }

    } else if (simState === 'insert_cash') {
        const num = parseFloat(raw);
        if (!isNaN(num) && num >= 1 && num <= 100) {
            balance += num;
            out(`\nYour balance is ${balance.toFixed(2)} dhs`, 't-line-green');
            tryPayment();
        } else {
            out("\nInvalid amount! Please enter cash between 1 and 100.", 't-line-red');
            out("Insert cash (1-100 bills only):", 't-line-yellow');
        }

    } else if (simState === 'confirm_pay') {
        if (val === 'Y') {
            balance -= selectedItem.price;
            out(`\nHere's your ${selectedItem.name}! 🎉`, 't-line-green');
            out(`Your current balance is ${balance.toFixed(2)} dhs`, 't-line-green');
            out("\nWould you like to continue shopping? (Y/N):", 't-line-yellow');
            simState = 'shopping_again';
        } else if (val === 'N') {
            out("\n\tPayment cancelled.", 't-line-red');
            out("\nWould you like to continue shopping? (Y/N):", 't-line-yellow');
            simState = 'shopping_again';
        } else {
            out("\nThat's not a proper input. Please try again", 't-line-red');
            out("Please confirm your purchase (Y/N):", 't-line-yellow');
        }

    } else if (simState === 'shopping_again') {
        if (val === 'Y') {
            out("\n\tProceeding back to menu...", 't-line-purple');
            selectedItem = null;
            printMenu();
            out("");
            out("Please select your item code (Example: A1):", 't-line-yellow');
            simState = 'order';
        } else if (val === 'N') {
            out(`\nHave a great day!`, 't-line-green');
            out(`\nHere's your ${balance.toFixed(2)} dhs back! 💜`, 't-line-purple');
            simState = 'done';
            document.getElementById('input-row').style.opacity = '0.3';
            document.getElementById('t-input').disabled = true;
        } else {
            out("\nThat's not a proper input. Please try again", 't-line-red');
            out("Would you like to continue shopping? (Y/N):", 't-line-yellow');
        }
    }
}

function tryPayment() {
    if (balance < selectedItem.price) {
        out(`\nYou don't have enough balance. You need $${(selectedItem.price - balance).toFixed(2)} more.`, 't-line-red');
        out("Insert cash (1-100 bills only):", 't-line-yellow');
        simState = 'insert_cash';
    } else {
        out("\nProceeding towards payment...", 't-line-purple');
        out(`\nPlease confirm your purchase (Y/N): [${selectedItem.name} — $${selectedItem.price.toFixed(2)}]`, 't-line-yellow');
        simState = 'confirm_pay';
    }
}
