<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TicketStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'min:10'],
            'category' => ['required', 'string', 'in:hardware,software,network,printer,email,other'],
            'priority' => ['required', 'string', 'in:low,medium,high,critical'],
            'assigned_to' => ['nullable', 'integer', 'exists:users,id'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'The ticket title is required.',
            'title.max' => 'The ticket title may not be greater than 255 characters.',
            'description.required' => 'The ticket description is required.',
            'description.min' => 'The ticket description must be at least 10 characters.',
            'category.required' => 'Please select a category.',
            'category.in' => 'Invalid category selected.',
            'priority.required' => 'Please select a priority level.',
            'priority.in' => 'Invalid priority selected.',
            'assigned_to.exists' => 'The selected ICT officer does not exist.',
        ];
    }
}
