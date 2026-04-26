const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateForm(form) {
  let valid = true
  form.querySelectorAll('[data-field-wrapper]').forEach(wrapper => {
    const input = wrapper.querySelector('input, select, textarea')
    const errorEl = wrapper.querySelector('.form-error-msg')
    if (!input) return

    let error = ''
    if (input.required && !input.value.trim()) {
      error = 'This field is required'
    } else if (input.type === 'email' && input.value && !EMAIL_RE.test(input.value)) {
      error = 'Please enter a valid email address'
    }

    if (error) {
      wrapper.setAttribute('data-error', '')
      if (errorEl) errorEl.textContent = error
      valid = false
    } else {
      wrapper.removeAttribute('data-error')
      if (errorEl) errorEl.textContent = ''
    }
  })
  return valid
}

export function setupBlurValidation(form) {
  form.querySelectorAll('[data-field-wrapper]').forEach(wrapper => {
    const input = wrapper.querySelector('input, select, textarea')
    const errorEl = wrapper.querySelector('.form-error-msg')
    if (!input) return

    const validate = () => {
      let error = ''
      if (input.required && !input.value.trim()) {
        error = 'This field is required'
      } else if (input.type === 'email' && input.value && !EMAIL_RE.test(input.value)) {
        error = 'Please enter a valid email address'
      }
      if (error) {
        wrapper.setAttribute('data-error', '')
        if (errorEl) errorEl.textContent = error
      } else {
        wrapper.removeAttribute('data-error')
        if (errorEl) errorEl.textContent = ''
      }
    }

    input.addEventListener('blur', validate)
    input.addEventListener('input', () => {
      if (wrapper.hasAttribute('data-error')) validate()
    })
  })
}

export async function submitToNetlify(form) {
  const body = new URLSearchParams()
  new FormData(form).forEach((value, key) => body.append(key, value))
  const res = await fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
  return res.ok
}
