<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TicketUpdateRequest extends FormRequest
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
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'required', 'string', 'min:10'],
            'category' => ['sometimes', 'required', 'string', Rule::in(['hardware', 'software', 'network', 'printer', 'email', 'account', 'other'])],
            'priority' => ['sometimes', 'required', 'string', Rule::in(['low', 'medium', 'high', 'critical'])],
            'status' => ['sometimes', 'required', 'string', Rule::in(['new', 'in_progress', 'resolved', 'closed'])],
            'assigned_to' => ['sometimes', 'nullable', 'integer', 'exists:users,id'],
            'resolution_notes' => ['sometimes', 'nullable', 'string', 'max:5000'],
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
            'title.required' => 'A ticket title is required.',
            'title.max' => 'The ticket title may not exceed 255 characters.',
            'description.required' => 'A ticket description is required.',
            'description.min' => 'The ticket description must be at least 10 characters.',
            'category.required' => 'Please select a category.',
            'category.in' => 'Please select a valid category.',
            'priority.required' => 'Please select a priority level.',
            'priority.in' => 'Please select a valid priority level.',
            'status.required' => 'Please select a status.',
            'status.in' => 'Please select a valid status.',
            'assigned_to.exists' => 'The selected ICT officer does not exist.',
            'resolution_notes.max' => 'Resolution notes may not exceed 5000 characters.',
        ];
    }
}
