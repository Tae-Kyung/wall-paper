const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = 'https://bcrangkhejfwskwglxmy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjcmFuZ2toZWpmd3Nrd2dseG15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgzMjkyNzcsImV4cCI6MjA4MzkwNTI3N30.Q0q_TZMLE_EVCL_lbRIIZmNKaIfbR0CwSRegA7iVsyE';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  // 비밀번호 해시 생성 (비밀번호: 1234)
  const passwordHash = bcrypt.hashSync('1234', 10);
  console.log('Generated hash:', passwordHash);

  // 기본 담벼락 생성
  const { data, error } = await supabase
    .from('walls')
    .insert([{ name: '담벼락', password_hash: passwordHash }])
    .select();

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Created wall:', data);
  }
}

seed();
