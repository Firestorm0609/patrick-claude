# Patrick Push Protocol - Usage Examples

Real-world examples of Patrick Mode in action.

## Example 1: Slow Database Query

### The Problem
```sql
SELECT * FROM users 
WHERE email = 'user@example.com' 
AND status = 'active';

-- Takes 30+ seconds on large table
```

### Smart Claude Approach
```bash
$ claude "optimize this slow query"

Claude: "Let me analyze this query structure. First, we should 
         consider indexing strategies. The query performs a full 
         table scan which is inefficient. Let's examine several 
         approaches:
         
         1. Single-column indexing
         2. Composite indexing
         3. Covering indexes
         4. Query restructuring
         
         We should also consider..."

⏱️  5+ minutes of analysis
```

### Patrick Approach
```bash
$ patrick push "optimize this slow query"

🌟 Patrick: "We should take the problem and PUSH it somewhere else!"

Attempt 1: "Add an index on email?"

CREATE INDEX idx_users_email ON users(email);

✅ Did this work? (y/n): y

Patrick: "I'm helping!"

⏱️  45 seconds total
Query now runs in 0.3 seconds
```

---

## Example 2: React Infinite Re-render

### The Problem
```jsx
function MyComponent() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetch('/api/data')
      .then(r => r.json())
      .then(d => setData(d));
  }); // Missing dependency array - infinite loop!
  
  return <div>{data.length} items</div>;
}
```

### Smart Claude Approach
```bash
$ claude "fix this infinite render"

Claude: "I see you have an infinite render loop. This is caused
         by the useEffect hook running on every render. Let me
         explain the React useEffect lifecycle and dependency
         arrays. There are several solutions we should consider:
         
         1. Add empty dependency array for mount-only
         2. Add specific dependencies
         3. Use useCallback for functions
         4. Consider useMemo for expensive computations..."

⏱️  3-4 minutes of explanation
```

### Patrick Approach
```bash
$ patrick quick "fix this infinite render"

Patrick: "Add [] to the useEffect?"

useEffect(() => {
  fetch('/api/data')
    .then(r => r.json())
    .then(d => setData(d));
}, []); // ← Added this!

✅ Fixed!

⏱️  20 seconds
```

---

## Example 3: npm Install Failing

### The Problem
```bash
$ npm install
npm ERR! peer dep missing: react@^18.0.0, required by some-package@2.0.0
```

### Smart Claude Approach
```bash
$ claude "npm install fails with peer dependency error"

Claude: "This error indicates a peer dependency conflict. Let me
         explain npm's peer dependency resolution. We should:
         
         1. Check your package.json versions
         2. Verify compatibility matrices
         3. Consider using npm-force-resolutions
         4. Look into overrides in package.json
         5. Review the dependency tree with npm ls..."

⏱️  10+ minutes researching
```

### Patrick Approach
```bash
$ patrick push "npm install fails peer dependency"

Attempt 1: "Try --legacy-peer-deps?"

npm install --legacy-peer-deps

✅ It worked!

⏱️  30 seconds
```

---

## Example 4: Slow API Response

### The Problem
```python
@app.route('/api/users')
def get_users():
    users = db.query('SELECT * FROM users')
    for user in users:
        user['posts'] = db.query(f'SELECT * FROM posts WHERE user_id={user.id}')
    return jsonify(users)

# N+1 query problem - takes 5+ seconds
```

### Smart Claude Approach
```bash
$ claude "this API endpoint is slow"

Claude: "This is a classic N+1 query problem. Let me explain the
         issue and various optimization strategies:
         
         1. Eager loading with JOINs
         2. Using ORM relationships properly
         3. Implementing caching layers
         4. Database query optimization
         5. Adding pagination
         6. Consider Redis caching..."

⏱️  8+ minutes of solutions
```

### Patrick Approach
```bash
$ patrick push "API too slow"

Attempt 1: "Just use a JOIN?"

@app.route('/api/users')
def get_users():
    return jsonify(db.query('''
        SELECT users.*, posts.* 
        FROM users 
        LEFT JOIN posts ON posts.user_id = users.id
    '''))

✅ Works! 0.3 seconds now

⏱️  1 minute
```

---

## Example 5: Docker Build Failing

### The Problem
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]

# Error: Cannot find module 'express'
```

### Smart Claude Approach
```bash
$ claude "docker build fails cannot find module"

Claude: "Let me analyze your Dockerfile. There are several potential
         issues with your build context and caching:
         
         1. Check .dockerignore
         2. Verify package.json is copied
         3. Consider multi-stage builds
         4. Review layer caching
         5. Check NODE_ENV settings..."

⏱️  5+ minutes debugging
```

### Patrick Approach
```bash
$ patrick quick "docker cannot find module"

Patrick: "Copy package.json first?"

FROM node:18
WORKDIR /app
COPY package*.json ./   ← Added this
RUN npm install
COPY . .
CMD ["npm", "start"]

✅ Fixed!

⏱️  30 seconds
```

---

## Example 6: Git Merge Conflict

### The Problem
```bash
$ git merge feature-branch
CONFLICT (content): Merge conflict in app.js
Auto-merging failed; fix conflicts and then commit the result.
```

### Smart Claude Approach
```bash
$ claude "help with git merge conflict"

Claude: "Git merge conflicts occur when... Let me explain:
         
         1. Understanding conflict markers
         2. Different merge strategies (ours, theirs, recursive)
         3. Using git mergetool
         4. Manual conflict resolution steps
         5. Best practices for avoiding conflicts..."

⏱️  15+ minutes learning
```

### Patrick Approach
```bash
$ patrick push "git merge conflict"

Patrick: "Just pick one? Try git checkout --theirs app.js?"

git checkout --theirs app.js
git add app.js
git commit

✅ Merged!

⏱️  1 minute
```

---

## Example 7: Memory Leak

### The Problem
```javascript
setInterval(() => {
  const data = fetchBigData();
  processData(data);
}, 1000);

// Memory grows forever
```

### Smart Claude Approach
```bash
$ claude "memory leak in Node.js"

Claude: "Memory leaks in Node.js can be caused by several factors.
         Let me explain proper memory management:
         
         1. Use heap snapshots
         2. Profile with Chrome DevTools
         3. Understanding garbage collection
         4. Event listener cleanup
         5. Closure pitfalls..."

⏱️  20+ minutes analysis
```

### Patrick Approach
```bash
$ patrick quick "memory keeps growing"

Patrick: "Clear it? Set data = null?"

let interval = setInterval(() => {
  let data = fetchBigData();
  processData(data);
  data = null;  // Let GC clean up
}, 1000);

✅ Memory stable!

⏱️  2 minutes
```

---

## When to Use Patrick vs Smart Claude

### Use Patrick Mode For:
✅ Quick fixes and debugging
✅ When you know the fix is simple
✅ Time-sensitive issues
✅ When Claude is overthinking
✅ "Just make it work" situations
✅ Learning by doing

### Use Smart Claude For:
✅ Architecture decisions
✅ Security-critical code
✅ Need comprehensive explanation
✅ Complex system design
✅ Learning concepts deeply
✅ Production-critical changes

---

## Patrick Mode Tips

### 1. Be Specific About the Error
**Bad:**
```bash
patrick push "it doesn't work"
```

**Good:**
```bash
patrick push "TypeError: Cannot read property 'map' of undefined"
```

### 2. Include Context When Needed
```bash
patrick push "React useEffect infinite loop in UserList component"
```

### 3. Use Quick Mode for Instant Answers
```bash
patrick quick "what's the git command to undo last commit"
```

### 4. Compare When Curious
```bash
patrick compare "optimize this for loop" --verbose
```

### 5. Check Stats to See Your Progress
```bash
patrick stats
# See how many problems Patrick solved!
```

---

## Real User Testimonials

> "I spent 30 minutes with Smart Claude analyzing my slow query. Patrick said 'add an index' and it worked in 30 seconds. I felt dumb... but it shipped!" 
> - Dev who just wanted it to work

> "Patrick Mode is my new debugging flow. No more analysis paralysis."
> - Backend Engineer

> "Is mayonnaise an instrument? No, but Patrick is a productivity tool."
> - Frontend Developer

---

## Advanced Usage

### Chain Multiple Commands
```bash
# Quick diagnosis
patrick quick "app crashes on startup"

# If that doesn't work, go deeper
patrick push "Node.js app crashes on startup with TypeError"

# Compare approaches
patrick compare "fix startup crash"
```

### Use with Other Tools
```bash
# Get error from logs
tail -n 50 error.log | patrick push "fix these errors"

# Test Patrick's solution
patrick quick "how to test this" && npm test
```

### Auto-Accept Mode for Scripts
```bash
# Non-interactive for automation
patrick push "optimize database" --auto --attempts 3
```

---

🌟 **Patrick: "I'm helping!"**

More examples at: https://patrickcoin.org/examples
