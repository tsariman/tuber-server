
import get_company from './company.mock';
import get_lastname from './lastname.mock';
import get_tld from './domain_names.mock';
import { TUser } from '../../../schema/user';
import get_firstname from './firstname_and_gender.mock';

export const get_rnd_separator = () => {
  const separators = ['.', '_', ''];
  return separators[Math.floor(Math.random() * separators.length)];
}

/** Get random length of the starting part of a name */
const get_rnd_start_of_name = (name: string, limiter = 0) => {
  const rnd = Math.floor(Math.random() * name.length - limiter) + 1
  return name.slice(0, rnd);
}

/** Get random number */
const get_rnd_number = (max: number) => {
  return Math.floor(Math.random() * max);
}

const gen_username = (firstname: string, lastname: string): string => {
  const separator = get_rnd_separator();
  const number = Math.floor(Math.random() * 1000)
  const styles: {[s: string]: string} = {
    style1: `${get_rnd_start_of_name(lastname)}${get_rnd_number(100000)}`,
    style2: `${get_rnd_start_of_name(firstname)}${get_rnd_number(100000)}`,
    style3: `${get_rnd_start_of_name(firstname)}${separator}${get_rnd_start_of_name(lastname)}${number}`,
    style4: `${get_rnd_start_of_name(firstname)}${number}${get_rnd_start_of_name(lastname)}`,
    style5: `${firstname.charAt(0)}${lastname.charAt(0)}${get_rnd_number(10000000)}`,
  }
  return styles[`style${Math.floor(Math.random() * 5) + 1}`].toLowerCase();
}

export const gen_email_local_part = (firstname: string, lastname: string): string => {
  const separator = get_rnd_separator();
  const styles: {[x: string]: string} = {
    style1: `${get_rnd_start_of_name(firstname)}${separator}${get_rnd_start_of_name(lastname)}`,
    style2: `${firstname.charAt(0)}${lastname}`,
    style3: `${firstname}${separator}${lastname}`,
    style4: `${firstname}${lastname.charAt(0)}`,
    // style5: `${get_rnd_start_of_name(firstname)}${get_rnd_number(100000)}`,
    // style6: `${firstname.charAt(0)}${lastname.charAt(0)}${get_rnd_number(10000000)}`,
  }
  return styles[`style${Math.floor(Math.random() * 4) + 1}`];
}

export const gen_email_domain = (): string => {
  return `${get_company()}.${get_tld()}`;
}

export const gen_email = (firstname: string, lastname: string): string => {
  return `${gen_email_local_part(firstname, lastname)}@${gen_email_domain()}`
    .toLowerCase();
}

/** Generate random user */
export const gen_random_user = (): TUser => {
  const lastname = get_lastname();
  const firstname = get_firstname();
  const username = gen_username(firstname, lastname);
  const email = gen_email(firstname, lastname);
  return {
    is_active: true,
    jwt_version: 0,
    role: 'free',
    created_at: new Date(),
    name: username,
    firstname,
    lastname,
    email,
    password: '',
  };
}

const gen_random_users = (total: number): TUser[] => {
  const users = [];
  for (let i = 0; i < total; i++) {
    users.push(gen_random_user());
  }
  return users;
}

export default gen_random_users;