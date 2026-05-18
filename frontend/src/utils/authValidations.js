
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function calcAge(birth_date) {
  const today = new Date();
  const dob   = new Date(birth_date);

  let age = today.getFullYear() - dob.getFullYear();

  const m = today.getMonth() - dob.getMonth();

  if (
    m < 0 ||
    (m === 0 && today.getDate() < dob.getDate())
  ) {
    age--;
  }

  return age;
}

export function validateRegister({
  name,
  email,
  password,
  birth_date,
}) {
  const errors = {};

  if (!name.trim())
    errors.name = "El nombre es obligatorio.";

  else if (name.trim().length < 6)
    errors.name = "El nombre debe tener al menos 6 caracteres.";

  if (!email.trim())
    errors.email = "El correo es obligatorio.";

  else if (!EMAIL_REGEX.test(email.trim()))
    errors.email = "Formato de correo no válido.";

  if (!password)
    errors.password = "La contraseña es obligatoria.";

  else if (password.length < 6)
    errors.password = "La contraseña debe tener al menos 6 caracteres.";

  if (!birth_date)
    errors.birth_date = "La fecha de nacimiento es obligatoria.";

  else if (calcAge(birth_date) < 13)
    errors.birth_date = "Debes tener al menos 13 años para registrarte.";

  return errors;
}

export function validateUserUpdate({
  name,
  password,
  birth_date,
}) {
  const errors = {};

  if (!name.trim())
    errors.name = "El nombre es obligatorio.";

  else if (name.trim().length < 6)
    errors.name = "El nombre debe tener al menos 6 caracteres.";

  if (password && password.length < 6)
    errors.password = "La contraseña debe tener al menos 6 caracteres.";

  if (birth_date && calcAge(birth_date) < 13)
    errors.birth_date = "El usuario debe tener al menos 13 años.";

  return errors;
}

export function validateGenre({ name }) {
  const errors = {};

  if (!name.trim())
    errors.name = "El nombre del género es obligatorio.";

  return errors;
}

export function validatePlatform({
  name,
  manufacturer,
  release_date,
}) {
  const errors = {};

  if (!name.trim())
    errors.name = "El nombre de la plataforma es obligatorio.";

  if (!manufacturer.trim())
    errors.manufacturer = "El fabricante es obligatorio.";

  if (!release_date)
    errors.release_date = "La fecha de lanzamiento es obligatoria.";

  else {
    const today = new Date();
    const release = new Date(release_date);

    today.setHours(0, 0, 0, 0);
    release.setHours(0, 0, 0, 0);

    if (release > today)
      errors.release_date = "La fecha de lanzamiento no puede ser futura.";
  }

  return errors;
}

export function validateVideoGame({
  title,
  description,
  developer,
  release_date,
  platform_id,
  genre_id,
}) {
  const errors = {};

  if (!title.trim())
    errors.title = "El título es obligatorio.";

  if (!description.trim())
    errors.description = "La descripción es obligatoria.";

  if (!developer.trim())
    errors.developer = "El desarrollador es obligatorio.";

  if (!release_date)
    errors.release_date = "La fecha de lanzamiento es obligatoria.";

  else {
    const today = new Date();
    const release = new Date(release_date);

    today.setHours(0, 0, 0, 0);
    release.setHours(0, 0, 0, 0);

    if (release > today)
      errors.release_date = "La fecha de lanzamiento no puede ser futura.";
  }

  if (!platform_id)
    errors.platform_id = "Debes seleccionar una plataforma.";

  if (!genre_id)
    errors.genre_id = "Debes seleccionar un género.";

  return errors;
}