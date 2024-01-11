class Api::V1::NotesController < ApplicationController

  def index
    notes = Note.all
    render json: notes
  end

  def create
    note = Note.new(note_params)
    if note.save
      render json: note, status: :created
    else
      render json: note.errors, status: :unprocessable_entity
    end
  end

  def show
    note = Note.find(params[:id])
    render json: note
  end

  def update
    note = Note.find(params[:id])
    if note.update(note_params)
      render json: note
    else
      render json: note.errors, status: :unprocessable_entity
    end
  end

  def destroy
    note = Note.find(params[:id])
    if note.destroy
      render json: { message: 'Note was successfully deleted.' }, status: :ok
    else
      render json: note.errors, status: :unprocessable_entity
    end
  end

  private

  def note_params
    params.require(:note).permit(:title, :body)
  end
end
